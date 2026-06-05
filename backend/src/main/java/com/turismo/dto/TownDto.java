package com.turismo.dto;

import com.turismo.model.Town;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TownDto {
    private Long id;
    private String slug;
    private String name;
    private String description;
    private String province;
    private String imageUrl;

    public static TownDto from(Town town) {
        return TownDto.builder()
                .id(town.getId())
                .slug(town.getSlug())
                .name(town.getName())
                .description(town.getDescription())
                .province(town.getProvince())
                .imageUrl(town.getImageUrl())
                .build();
    }
}
