package com.demo.mohazo.common.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
public class NotionDescResponse<T> {
    private final String message;
    private final T data;
}