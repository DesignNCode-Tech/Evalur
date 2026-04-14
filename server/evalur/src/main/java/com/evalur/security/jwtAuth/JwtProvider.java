package com.evalur.security.jwtAuth;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import com.evalur.domain.user.entity.User; 

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    @Value("${evalur.jwt.secret}")
    private String secretKey; 

    @Value("${evalur.jwt.expirationMs}")
    private long jwtExpiration; 

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * UPDATED: Now includes Org ID and Role in the standard login token.
     */
    public String generateToken(UserDetails userDetails) {
        Map<String, Object> claims = new HashMap<>();
        
        // 👈 Check if it's our custom User to extract the Org ID
        if (userDetails instanceof User user) {
            claims.put("role", user.getRole().name());
            if (user.getOrganization() != null) {
                claims.put("orgId", user.getOrganization().getId());
            }
        }
        
        return Jwts.builder()
                .setClaims(claims) //  Claims must be set before subject/dates
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration)) 
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean isTokenValid(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername())) && !isTokenExpired(token);
    }

    // ========================================================================
    // INTERNAL HELPER LOGIC
    // ========================================================================

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSignInKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private boolean isTokenExpired(String token) {
        return extractClaim(token, Claims::getExpiration).before(new Date());
    }

    private Key getSignInKey() {
        byte[] keyBytes = Decoders.BASE64.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    // ========================================================================
    // B2B SAAS LOGIC (Multi-Tenancy)
    // ========================================================================

    public String generateInviteToken(Long orgId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("orgId", orgId);
        claims.put("role", role);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject("INVITATION_TOKEN") 
                .setIssuedAt(new Date(System.currentTimeMillis()))
                // 7 days expiration for invites
                .setExpiration(new Date(System.currentTimeMillis() + 604800000)) 
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Long extractOrgId(String token) {
        // Handle potential nulls or different numeric types from JSON
        Object orgId = extractAllClaims(token).get("orgId");
        if (orgId == null) return null;
        return Long.valueOf(orgId.toString());
    }

    public String extractRole(String token) {
        return extractClaim(token, claims -> claims.get("role", String.class));
    }
}