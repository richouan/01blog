package com.zone01.blog.controller;

import com.zone01.blog.dto.ReportRequest;
import com.zone01.blog.dto.ReportResponse;
import com.zone01.blog.service.ReportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // Submit an inappropriate content or profile report
    @PostMapping
    public ResponseEntity<ReportResponse> submitReport(@RequestBody ReportRequest request, Authentication authentication) {
        if (authentication == null || authentication.getName() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        ReportResponse response = reportService.submitReport(authentication.getName(), request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}
