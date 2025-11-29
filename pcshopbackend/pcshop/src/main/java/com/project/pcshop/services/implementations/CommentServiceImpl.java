package com.project.pcshop.services.implementations;

import com.project.pcshop.exceptions.InvalidParamException;
import com.project.pcshop.responses.CommentResponse;
import com.project.pcshop.security.components.SecurityUtil;
import com.project.pcshop.dtos.comment.CommentDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.exceptions.PermissionDenyException;
import com.project.pcshop.models.entities.Comment;
import com.project.pcshop.models.entities.Product;
import com.project.pcshop.models.entities.User;
import com.project.pcshop.repositories.CommentRepository;
import com.project.pcshop.repositories.ProductRepository;
import com.project.pcshop.repositories.UserRepository;
import com.project.pcshop.services.interfaces.CommentService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CommentServiceImpl implements CommentService {

	private final CommentRepository commentRepository;
	private final ProductRepository productRepository;
	private final UserRepository userRepository;
	private final SecurityUtil securityUtil;

    @Transactional
	@Override
	public CommentResponse createComment(CommentDTO commentDTO) throws Exception {
		Long currentUserId = securityUtil.getCurrentUser();
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
				throw new InvalidParamException("Root comment does not belong to this product");
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
        commentRepository.save(newComment);
        return CommentResponse.fromComment(newComment);
	}

	@Override
	public Page<CommentResponse> getRootCommentsByProduct(Long productId, int page, int size, String sort) throws Exception {
        productRepository.findById(productId).orElseThrow(() -> new DataNotFoundException("Product not found"));

		Sort sortByCreatedAt = Sort.by("createdAt");
		if ("asc".equalsIgnoreCase(sort)) sortByCreatedAt = sortByCreatedAt.ascending();
        else sortByCreatedAt = sortByCreatedAt.descending();

		Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, sortByCreatedAt);
		Page<Comment> comments = commentRepository.findByProduct_IdAndRootCommentIsNullAndActiveTrue(productId, pageable);
        return comments.map(CommentResponse::fromComment);
	}

	@Override
	public Page<CommentResponse> getReplies(Long rootCommentId, int page, int size, String sort) throws Exception {
        commentRepository.findById(rootCommentId).orElseThrow(() -> new DataNotFoundException("Comment not found"));

		Sort sortByCreatedAt = Sort.by("createdAt");
		if ("desc".equalsIgnoreCase(sort)) sortByCreatedAt = sortByCreatedAt.descending();
        else sortByCreatedAt = sortByCreatedAt.ascending();

        Pageable pageable = PageRequest.of(Math.max(page - 1, 0), size, sortByCreatedAt);

        Page<Comment> replies = commentRepository.findByRootComment_IdAndActiveTrue(rootCommentId, pageable);
        return replies.map(CommentResponse::fromComment);
	}

    @Transactional
	@Override
	public CommentResponse updateComment(Long commentId, String content) throws Exception {
		Comment existingComment = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));

		Long userId = securityUtil.getCurrentUser();
		Long ownerId = existingComment.getUser() != null ? existingComment.getUser().getId() : null;
		boolean isOwner = ownerId != null && ownerId.equals(userId);
		if (!isOwner) {
			throw new PermissionDenyException("You don't have permission to edit this comment");
		}

        existingComment.setContent(content);
        existingComment.setEdited(true);
        commentRepository.save(existingComment);

        return CommentResponse.fromComment(existingComment);
	}

    @Transactional
    @Override
	public void deleteComment(Long commentId) throws Exception {
		Comment existingComment = commentRepository.findById(commentId)
				.orElseThrow(() -> new DataNotFoundException("Comment not found"));

		Long userId = securityUtil.getCurrentUser();
		boolean isAdmin = securityUtil.currentUserIsAdmin();
		Long ownerId = existingComment.getUser() != null ? existingComment.getUser().getId() : null;
		boolean isOwner = ownerId != null && ownerId.equals(userId);
		if (!(isAdmin || isOwner)) {
			throw new PermissionDenyException("You don't have permission to delete this comment");
		}
        commentRepository.delete(existingComment);
	}
}
