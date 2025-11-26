package com.project.pcshop.advice;

import com.project.pcshop.common.ApiResponse;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.InvalidParamException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.List;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneralException(Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .message(e.getMessage())
                .responseObject(null)
                .build()
        );
    }

    @ExceptionHandler({DataNotFoundException.class})
    public ResponseEntity<ApiResponse<?>> handleAppException(Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .status(HttpStatus.NOT_FOUND)
                .message(e.getMessage())
                .responseObject(null)
                .build()
        );
    }

    @ExceptionHandler({InvalidParamException.class})
    public ResponseEntity<ApiResponse<?>> handleParamException(Exception e) {
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(e.getMessage())
                .responseObject(null)
                .build()
        );
    }

    @ExceptionHandler({MethodArgumentNotValidException.class})
    public ResponseEntity<ApiResponse<?>> handleValidationException(MethodArgumentNotValidException e) {
        List<String> errorMessages = e.getBindingResult().getFieldErrors()
                .stream()
                .map(FieldError::getDefaultMessage)
                .toList();
        return ResponseEntity.badRequest().body(ApiResponse.builder()
                .status(HttpStatus.BAD_REQUEST)
                .message(String.join(", ", errorMessages))
                .responseObject(null)
                .build()
        );
    }
}
