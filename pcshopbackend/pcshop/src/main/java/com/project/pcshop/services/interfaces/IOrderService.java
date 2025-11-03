package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.OrderDTO;
import com.project.pcshop.dtos.OrderUpdateInfoDTO;
import com.project.pcshop.dtos.OrderUpdateStatusDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.models.entities.Order;
import com.project.pcshop.models.enums.OrderStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IOrderService {
    Order createOrderFromCart(Long userId, OrderDTO orderDTO);
    List<Order> getAllOrders();
    Page<Order> getOrdersByUser(Long userId, Pageable pageable);
    Order getOrderWithDetails(Long id);
    Order updateOrderInfo(Long id, OrderUpdateInfoDTO orderUpdateInfoDTO);
    Order updateOrderStatus(Long id, OrderUpdateStatusDTO orderUpdateStatusDTO);
    void cancelOrder(Long id) throws DataNotFoundException;
}
