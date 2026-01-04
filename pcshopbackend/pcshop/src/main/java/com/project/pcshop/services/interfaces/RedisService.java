package com.project.pcshop.services.interfaces;

import java.util.concurrent.TimeUnit;
import com.fasterxml.jackson.core.type.TypeReference;

public interface RedisService {
    void set(String key, Object value);
    void setWithTimeout(String key, Object value, long timeout, TimeUnit unit);
    <T> T get(String key, TypeReference<T> type);
    void delete(String key);
    boolean hasKey(String key);
    void deleteByPattern(String pattern);
}