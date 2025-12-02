package com.project.pcshop.repositories;

import com.project.pcshop.entities.Comment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {
    Page<Comment> findByProduct_IdAndActiveTrue(Long productId, Pageable pageable);
    Page<Comment> findByProduct_IdAndRootCommentIsNullAndActiveTrue(Long productId, Pageable pageable);
    Page<Comment> findByRootComment_IdAndActiveTrue(Long rootCommentId, Pageable pageable);
}
