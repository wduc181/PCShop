package com.project.pcshop.services.interfaces;

import com.project.pcshop.models.entities.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    List<OrderDetail> getOrderDetailsByOrder(Long orderId) throws Exception;
}
