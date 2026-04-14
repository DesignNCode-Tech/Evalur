package com.evalur.security.jwtAuth;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtProvider {

    // 1. Load secret and expiration from application.properties
    @Value("${evalur.jwt.secret}")
    private String secretKey; 

    // 2. Load expiration time (in milliseconds) from application.properties
    @Value("${evalur.jwt.expirationMs}")
    private long jwtExpiration; 

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public String generateToken(UserDetails userDetails) {
        return Jwts.builder()
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

    private <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
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
    // INVITATION LOGIC (B2B SaaS)
    // ========================================================================

    /**
     * Generates a 7 day invite token for invitations, storing the Org ID and Role.
     */
    public String generateInviteToken(Long orgId, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("orgId", orgId);
        claims.put("role", role);
        
        return Jwts.builder()
                .setClaims(claims)
                .setSubject("INVITATION_TOKEN") 
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7)) // 7 days
                .signWith(getSignInKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    // Helper to extract OrgId from the invite token
    public Long extractOrgId(String token) {
        return extractAllClaims(token).get("orgId", Long.class);
    }

    // Helper to extract Role from the invite token
    public String extractRole(String token) {
        return extractAllClaims(token).get("role", String.class);
    }
}