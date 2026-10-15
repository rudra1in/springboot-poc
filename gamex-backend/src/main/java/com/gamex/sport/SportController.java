package com.gamex.sport;

import com.gamex.common.ApiResponse;
import com.gamex.sport.dto.SportRequest;
import com.gamex.sport.dto.SportResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/sports")
@RequiredArgsConstructor
public class SportController {

    private final SportService sportService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<SportResponse>>> list(
            @PageableDefault(size = 20, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {
        return ResponseEntity.ok(ApiResponse.ok(sportService.list(pageable)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<SportResponse>> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(ApiResponse.ok(sportService.getById(id)));
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<SportResponse>> create(
            @Valid @RequestBody SportRequest request) {
        SportResponse response = sportService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok(response, "Sport configuration saved successfully"));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<SportResponse>> update(
            @PathVariable UUID id,
            @Valid @RequestBody SportRequest request) {
        return ResponseEntity.ok(
                ApiResponse.ok(sportService.update(id, request), "Sport configuration updated successfully"));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        sportService.delete(id);
        return ResponseEntity.ok(ApiResponse.ok(null, "Sport deleted successfully"));
    }
}
