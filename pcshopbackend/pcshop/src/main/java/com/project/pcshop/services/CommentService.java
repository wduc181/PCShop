package com.project.pcshop.services;

import com.project.pcshop.dtos.CommentDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.Comment;
import com.project.pcshop.models.Product;
import com.project.pcshop.models.User;
import com.project.pcshop.repositories.CommentRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {
	private final CommentRepository commentRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;

	@Override
	@Transactional
	public Comment createComment(CommentDTO dto) throws DataNotFoundException {
		if (dto == null) throw new IllegalArgumentException("CommentDTO is null");

		Product product = productRepository.findById(dto.getProductId())
				.orElseThrow(() -> new DataNotFoundException("Product not found"));
		User user = userRepository.findById(dto.getUserId())
				.orElseThrow(() -> new DataNotFoundException("User not found"));

		Comment root = null;
		if (dto.getRootCommentId() != null) {
			root = commentRepository.findById(dto.getRootCommentId())
					.orElseThrow(() -> new DataNotFoundException("Root comment not found"));
			if (!root.getProduct().getId().equals(product.getId())) {
				throw new IllegalArgumentException("Root comment does not belong to this product");
			}
		}

		Comment c = Comment.builder()
				.product(product)
				.user(user)
				.rootComment(root)
				.content(dto.getContent())
				.edited(false)
				.active(true)
				.build();
		return commentRepository.save(c);
	}

	@Override
	public Page<Comment> getRootCommentsByProduct(Long productId, Pageable pageable) {
		return commentRepository.findByProduct_IdAndRootCommentIsNullAndActiveTrue(productId, pageable);
	}

	@Override
	public Page<Comment> getReplies(Long rootCommentId, Pageable pageable) {
		return commentRepository.findByRootComment_IdAndActiveTrue(rootCommentId, pageable);
	}

	@Override
	@Transactional
	public Comment updateComment(Long commentId, Long userId, String content, boolean isAdmin) throws DataNotFoundException {
		Comment c = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));
		if (!c.isActive()) {
			throw new DataNotFoundException("Comment is deactivated");
		}
		Long ownerId = c.getUser() != null ? c.getUser().getId() : null;
		boolean owner = ownerId != null && ownerId.equals(userId);
		if (!(isAdmin || owner)) {
			throw new PermissionDenyException("You don't have permission to edit this comment");
		}
		c.setContent(content);
		c.setEdited(true);
		return commentRepository.save(c);
	}

	@Override
	@Transactional
	public void deleteComment(Long commentId, Long userId, boolean isAdmin) throws DataNotFoundException {
		Comment c = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));
		Long ownerId = c.getUser() != null ? c.getUser().getId() : null;
		boolean owner = ownerId != null && ownerId.equals(userId);
		if (!(isAdmin || owner)) {
			throw new PermissionDenyException("You don't have permission to delete this comment");
		}
		c.setActive(false);
		commentRepository.save(c);
	}
}
