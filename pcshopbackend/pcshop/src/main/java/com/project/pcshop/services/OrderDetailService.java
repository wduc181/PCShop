package com.project.pcshop.services;

import com.project.pcshop.components.SecurityUtil;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.entities.Order;
import com.project.pcshop.models.entities.OrderDetail;
import com.project.pcshop.repositories.OrderDetailRepository;
import com.project.pcshop.repositories.OrderRepository;
import com.project.pcshop.services.interfaces.IOrderDetailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderDetailService implements IOrderDetailService {
    private final SecurityUtil securityUtil;
    private final OrderDetailRepository orderDetailRepository;
    private final OrderRepository orderRepository;

    @Override
    public List<OrderDetail> getOrderDetailsByOrder(Long orderId) throws Exception {
        Order existingOrder = orderRepository.findById(orderId)
                .orElseThrow(() -> new DataNotFoundException("Order not found"));
        if (!(securityUtil.currentUserIsAdmin() || securityUtil.currentUserIsValid(existingOrder.getUser().getId()))) {
            throw new PermissionDenyException("You don't have permission to view this order detail");
        }
        return orderDetailRepository.findByOrderId(orderId);
    }
}
