package com.evalur.common;

import lombok.Builder;
import java.time.LocalDateTime;


// ApiResponse is a generic record that standardizes the structure of API responses across the application,
//  providing a consistent format for success and error messages.
@Builder
public record ApiResponse<T>(
    boolean success,
    String message,
    T data,
    LocalDateTime timestamp
) {
    public static <T> ApiResponse<T> success(T data, String message) {
        return new ApiResponse<>(true, message, data, LocalDateTime.now());
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(false, message, null, LocalDateTime.now());
    }
}