package com.project.pcshop.services.implementations;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.project.pcshop.exceptions.RedisException;
import com.project.pcshop.services.interfaces.RedisService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class RedisServiceImpl implements RedisService {
    private final RedisTemplate<String, Object> redisTemplate;
    private final ObjectMapper objectMapper;

    private void execute(Runnable action, String errorMessage) {
        try {
            action.run();
        } catch (Exception e) {
            throw new RedisException("Error in " + errorMessage, e);
        }
    }

    @Override
    public void set(String key, Object value) {
        execute(() -> redisTemplate.opsForValue().set(key, value), "setting value for key: " + key);
    }

    @Override
    public void setWithTimeout(String key, Object value, long timeout, TimeUnit unit) {
        execute(() -> redisTemplate.opsForValue().set(key, value, timeout, unit),
                "setting value with timeout for key: " + key);
    }

    @Override
    public <T> T get(String key, TypeReference<T> type) {
        try {
            Object value = redisTemplate.opsForValue().get(key);
            if (value == null) {
                System.out.println("[CACHE MISS]--------- " + key);
                return null;
            }
            System.out.println("[CACHE HIT]--------- " + key);
            return objectMapper.convertValue(value, type);
        } catch (Exception e) {
            System.out.println("[CACHE ERROR]--------- " + key + " -> " + e.getMessage());
            return null;
        }
    }

    @Override
    public void delete(String key) {
        execute(() -> redisTemplate.delete(key), "deleting key: " + key);
    }

    @Override
    public boolean hasKey(String key) {
        try {
            return redisTemplate.hasKey(key);
        } catch (Exception e) {
            throw new RedisException("Error in checking existence of key: " + key, e);
        }
    }

    @Override
    public void deleteByPattern(String pattern) {
        try {
            Set<String> keys = redisTemplate.keys(pattern);
            if (!keys.isEmpty()) {
                redisTemplate.delete(keys);
            }
        } catch (Exception e) {
            throw new RedisException("Error in deleting by pattern: " + pattern, e);
        }
    }
}