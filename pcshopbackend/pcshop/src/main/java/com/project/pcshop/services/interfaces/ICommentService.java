package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CommentDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.models.Comment;
import org.springframework.data.domain.Page;

public interface ICommentService {
	Comment createComment(CommentDTO dto) throws Exception;
	Page<Comment> getRootCommentsByProduct(Long productId, int page, int size, String sort);
	Page<Comment> getReplies(Long rootCommentId, int page, int size, String sort);
	Comment updateComment(Long commentId, String content) throws Exception;
	void deleteComment(Long commentId) throws Exception;
}
