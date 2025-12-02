package com.project.pcshop.services.interfaces;

import com.project.pcshop.responses.OrderDetailResponse;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetailResponse> getOrderDetailsByOrder(Long orderId) throws Exception;
}
