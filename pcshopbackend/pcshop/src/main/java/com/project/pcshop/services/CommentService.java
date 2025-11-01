package com.project.pcshop.services;

import com.project.pcshop.components.SecurityUtil;
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
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService {

	private final CommentRepository commentRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final SecurityUtil securityUtil;

	@Override
	public Comment createComment(CommentDTO commentDTO) throws Exception {
		Long currentUserId = securityUtil.getCurrentUserId();
		if (currentUserId == null) throw new PermissionDenyException("Unauthorized");

		Product product = productRepository.findById(commentDTO.getProductId())
				.orElseThrow(() -> new DataNotFoundException("Product not found"));
		User user = userRepository.findById(currentUserId)
				.orElseThrow(() -> new DataNotFoundException("User not found"));
		Comment root = null;
		if (commentDTO.getRootCommentId() != null) {
			root = commentRepository.findById(commentDTO.getRootCommentId())
					.orElseThrow(() -> new DataNotFoundException("Root comment not found"));
			if (!root.getProduct().getId().equals(product.getId())) {
				throw new IllegalArgumentException("Root comment does not belong to this product");
			}
		}

		Comment newComment = Comment.builder()
				.product(product)
				.user(user)
				.rootComment(root)
				.content(commentDTO.getContent())
				.edited(false)
				.active(true)
				.build();
		return commentRepository.save(newComment);
	}

	@Override
	public Page<Comment> getRootCommentsByProduct(Long productId, int page, int size, String sort) {
		Sort sortByCreatedAt = Sort.by("createdAt");
		if ("asc".equalsIgnoreCase(sort)) sortByCreatedAt = sortByCreatedAt.ascending();
        else sortByCreatedAt = sortByCreatedAt.descending();

		Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, sortByCreatedAt);

		return commentRepository.findByProduct_IdAndRootCommentIsNullAndActiveTrue(productId, pageable);
	}

	@Override
	public Page<Comment> getReplies(Long rootCommentId, int page, int size, String sort) {
		Sort sortByCreatedAt = Sort.by("createdAt");
		if ("desc".equalsIgnoreCase(sort)) sortByCreatedAt = sortByCreatedAt.descending();
        else sortByCreatedAt = sortByCreatedAt.ascending();

        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, sortByCreatedAt);

		return commentRepository.findByRootComment_IdAndActiveTrue(rootCommentId, pageable);
	}

	@Override
	public Comment updateComment(Long commentId, String content) throws Exception {
		Comment existingComment = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));
		if (!existingComment.isActive()) {
			throw new DataNotFoundException("Comment is unavailable to access");
		}

		Long userId = securityUtil.getCurrentUserId();
		boolean isAdmin = securityUtil.currentUserIsAdmin();
		Long ownerId = existingComment.getUser() != null ? existingComment.getUser().getId() : null;
		boolean isOwner = ownerId != null && ownerId.equals(userId);
		if (!(isAdmin || isOwner)) {
			throw new PermissionDenyException("You don't have permission to edit this comment");
		}

        existingComment.setContent(content);
        existingComment.setEdited(true);

		return commentRepository.save(existingComment);
	}

    @Override
	public void deleteComment(Long commentId) throws Exception {
		Comment existingComment = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));

		Long userId = securityUtil.getCurrentUserId();
		boolean isAdmin = securityUtil.currentUserIsAdmin();
		Long ownerId = existingComment.getUser() != null ? existingComment.getUser().getId() : null;
		boolean isOwner = ownerId != null && ownerId.equals(userId);
		if (!(isAdmin || isOwner)) {
			throw new PermissionDenyException("You don't have permission to delete this comment");
		}
        existingComment.setActive(false);

		commentRepository.save(existingComment);
	}
}
