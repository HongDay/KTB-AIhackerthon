package com.demo.mohazo.common.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.*;

@Service
@RequiredArgsConstructor
public class NotionService {
    private final WebClient webClient;

    public void updatePageWithTitleAndMarkdown(String notionPageUrlDesc, String pageTitle, String markdownContent, String notionSecretKey) {
        updatePageTitle(notionPageUrlDesc, pageTitle, notionSecretKey);
        addMarkdownContentToPage(notionPageUrlDesc, markdownContent, notionSecretKey);
    }
    
    private void updatePageTitle(String notionPageUrlDesc, String pageTitle, String notionSecretKey) {
        Map<String, Object> props = new HashMap<>();
        props.put("title", List.of(Map.of("text", Map.of("content", pageTitle))));
        
        webClient.patch()
            .uri("/pages/" + notionPageUrlDesc)
            .header("Authorization", "Bearer " + notionSecretKey)
            .header("Notion-Version", "2022-06-28")
            .bodyValue(Map.of("properties", props))
            .retrieve()
            .toBodilessEntity()
            .block();
    }

    public void addMarkdownContentToPage(String notionPageUrlDesc, String markdownContent, String notionSecretKey) {
    // \n (백슬래시 + n)을 실제 줄바꿈 문자로 변환
    String normalizedContent = markdownContent.replace("\\n", "\n");
    
    String[] lines = normalizedContent.split("\n");
    List<Map<String, Object>> children = new ArrayList<>();
    
    for (String line : lines) {
        if (line.trim().isEmpty()) {
            children.add(createParagraphBlock(""));
            continue;
        }
        
        Map<String, Object> block = parseMarkdownLine(line);
        if (block != null) {
            children.add(block);
        }
    }
    
    int batchSize = 100;
    for (int i = 0; i < children.size(); i += batchSize) {
        int end = Math.min(i + batchSize, children.size());
        List<Map<String, Object>> batch = children.subList(i, end);
        
        webClient.patch()
            .uri("/blocks/" + notionPageUrlDesc + "/children")
            .header("Authorization", "Bearer " + notionSecretKey)
            .header("Notion-Version", "2022-06-28")
            .bodyValue(Map.of("children", batch))
            .retrieve()
            .bodyToMono(Map.class)
            .block();
    }
}

    private Map<String, Object> parseMarkdownLine(String line) {
        String trimmed = line.trim();
        
        // Heading 1: # 제목
        if (trimmed.startsWith("# ")) {
            return createHeading1Block(trimmed.substring(2));
        }
        
        // Heading 2: ## 제목
        if (trimmed.startsWith("## ")) {
            return createHeading2Block(trimmed.substring(3));
        }
        
        // Heading 3: ### 제목
        if (trimmed.startsWith("### ")) {
            return createHeading3Block(trimmed.substring(4));
        }
        
        // Divider: ---
        if (trimmed.equals("---") || trimmed.matches("^-{3,}$")) {
            return createDividerBlock();
        }
        
        // 일반 텍스트 (bold 처리 포함) - createParagraphBlockWithFormatting 사용
        return createParagraphBlockWithFormatting(line);
    }
    
    private Map<String, Object> createHeading1Block(String text) {
        return Map.of(
            "object", "block",
            "type", "heading_1",
            "heading_1", Map.of("rich_text", parseRichText(text))
        );
    }
    
    private Map<String, Object> createHeading2Block(String text) {
        return Map.of(
            "object", "block",
            "type", "heading_2",
            "heading_2", Map.of("rich_text", parseRichText(text))
        );
    }
    
    private Map<String, Object> createHeading3Block(String text) {
        return Map.of(
            "object", "block",
            "type", "heading_3",
            "heading_3", Map.of("rich_text", parseRichText(text))
        );
    }
    
    private Map<String, Object> createDividerBlock() {
        return Map.of(
            "object", "block",
            "type", "divider",
            "divider", Map.of()
        );
    }
    
    private Map<String, Object> createParagraphBlock(String text) {
        return Map.of(
            "object", "block",
            "type", "paragraph",
            "paragraph", Map.of("rich_text", parseRichText(text))
        );
    }
    
    private Map<String, Object> createParagraphBlockWithFormatting(String text) {
        return createParagraphBlock(text);
    }
    
    // Rich Text 파싱 (bold, italic 등 처리)
    private List<Map<String, Object>> parseRichText(String text) {
        List<Map<String, Object>> richText = new ArrayList<>();
        
        // **bold** 처리
        if (text.contains("**")) {
            String[] parts = text.split("\\*\\*");
            boolean isBold = false;
            
            for (String part : parts) {
                if (part.isEmpty()) {
                    isBold = !isBold;
                    continue;
                }
                
                Map<String, Object> textObj = new HashMap<>();
                textObj.put("type", "text");
                
                Map<String, Object> textContent = new HashMap<>();
                textContent.put("content", part);
                textObj.put("text", textContent);
                
                if (isBold) {
                    Map<String, Object> annotations = new HashMap<>();
                    annotations.put("bold", true);
                    textObj.put("annotations", annotations);
                }
                
                richText.add(textObj);
                isBold = !isBold;
            }
        } else {
            // bold가 없는 경우
            richText.add(Map.of(
                "type", "text",
                "text", Map.of("content", text)
            ));
        }
        
        return richText;
    }
}