package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.comment.CommentDTO;
import com.project.pcshop.responses.CommentResponse;
import org.springframework.data.domain.Page;

public interface CommentService {
	CommentResponse createComment(CommentDTO dto) throws Exception;
	Page<CommentResponse> getRootCommentsByProduct(Long productId, int page, int size, String sort) throws Exception;
	Page<CommentResponse> getReplies(Long rootCommentId, int page, int size, String sort) throws Exception;
	CommentResponse updateComment(Long commentId, String content) throws Exception;
	void deleteComment(Long commentId) throws Exception;
}
