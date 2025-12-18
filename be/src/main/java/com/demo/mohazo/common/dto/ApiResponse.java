package com.demo.mohazo.common.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

@Builder
@NoArgsConstructor
@Getter
@Setter
public class ApiResponse<T> {

    private String message;

    @JsonInclude(JsonInclude.Include.ALWAYS)
    private T data;

    public ApiResponse(String message, T data){
        this.message = message;
        this.data = data;
    }
}
