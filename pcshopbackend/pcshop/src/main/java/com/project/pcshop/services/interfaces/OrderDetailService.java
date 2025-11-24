package com.project.pcshop.services.interfaces;

import com.project.pcshop.models.entities.OrderDetail;

import java.util.List;

public interface OrderDetailService {
    List<OrderDetail> getOrderDetailsByOrder(Long orderId) throws Exception;
}
