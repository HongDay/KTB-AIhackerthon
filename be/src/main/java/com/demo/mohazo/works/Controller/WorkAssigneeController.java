package com.demo.mohazo.works.Controller;

import com.demo.mohazo.common.dto.ApiResponse;
import com.demo.mohazo.works.entity.Works;
import com.demo.mohazo.works.service.WorksService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/work/assign")
public class WorkAssigneeController {

    public final WorksService worksService;


    @PostMapping
    public ResponseEntity<?> assignTask(){

        List<Works> worksList = worksService.assignworks();
        return ResponseEntity.ok().body(new ApiResponse<>("Task assign success", worksList));
    }

}
