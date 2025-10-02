package com.project.pcshop.services.interfaces;

import com.project.pcshop.models.OrderDetail;

import java.util.List;

public interface IOrderDetailService {
    List<OrderDetail> getOrderDetailsByOrder(Long orderId);
    OrderDetail getOrderDetailById(Long id);
    void deleteOrderDetail(Long id);
}
