package com.project.pcshop.configurations;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/brands/**")
                .addResourceLocations("file:uploads/brands/");
        registry.addResourceHandler("/uploads/products/**")
                .addResourceLocations("file:uploads/products/");
    }
}
