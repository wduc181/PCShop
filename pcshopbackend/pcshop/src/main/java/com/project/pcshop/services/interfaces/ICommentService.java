package com.project.pcshop.services.interfaces;

import com.project.pcshop.dtos.CommentDTO;
import com.project.pcshop.exceptions.DataNotFoundException;
import com.project.pcshop.models.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ICommentService {
	Comment createComment(CommentDTO dto) throws DataNotFoundException;
	Page<Comment> getRootCommentsByProduct(Long productId, Pageable pageable);
	Page<Comment> getReplies(Long rootCommentId, Pageable pageable);
	Comment updateComment(Long commentId, Long userId, String content, boolean isAdmin) throws DataNotFoundException;
	void deleteComment(Long commentId, Long userId, boolean isAdmin) throws DataNotFoundException;
}
