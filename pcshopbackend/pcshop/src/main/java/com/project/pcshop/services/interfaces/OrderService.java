package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.order.OrderCreateDTO;
import com.project.pcshop.dtos.order.OrderUpdateInfoDTO;
import com.project.pcshop.dtos.order.OrderUpdateStatusDTO;
import com.project.pcshop.responses.OrderResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public interface OrderService {
    OrderResponse createOrderFromCart(Long userId, OrderCreateDTO orderCreateDTO) throws Exception;
    List<OrderResponse> getAllOrders();
    Page<OrderResponse> getOrdersByUser(Long userId, Integer page, Integer size) throws Exception;
    OrderResponse getOrderWithDetails(Long id) throws  Exception;
    OrderResponse updateOrderInfo(Long id, OrderUpdateInfoDTO orderUpdateInfoDTO) throws Exception;
    OrderResponse updateOrderStatus(Long id, OrderUpdateStatusDTO orderUpdateStatusDTO) throws Exception;
    void cancelOrder(Long id) throws Exception;
}
