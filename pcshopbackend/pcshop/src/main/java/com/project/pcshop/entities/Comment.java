package com.project.pcshop.entities;

import jakarta.persistence.*;
import lombok.*;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.util.LinkedHashSet;
import java.util.Set;


@Entity
@Table(
	name = "comments",
	indexes = {
		@Index(name = "idx_comments_product", columnList = "product_id"),
		@Index(name = "idx_comments_user", columnList = "user_id"),
		@Index(name = "idx_comments_root", columnList = "root_comment_id")
	}
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"product", "user", "rootComment", "replies"})
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Comment extends BaseEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne
	@JoinColumn(name = "product_id", nullable = false,
		foreignKey = @ForeignKey(name = "fk_comments_product"))
	private Product product;

	@ManyToOne
	@JoinColumn(name = "user_id",
		foreignKey = @ForeignKey(name = "fk_comments_user"))
	private User user;

	@ManyToOne
	@JoinColumn(name = "root_comment_id",
		foreignKey = @ForeignKey(name = "fk_comments_root"))
	private Comment rootComment;

	@OneToMany(mappedBy = "rootComment")
	private Set<Comment> replies = new LinkedHashSet<>();

	@Lob
	@Column(name = "content", nullable = false)
	private String content;

	@Column(name = "is_edited", nullable = false)
	private boolean edited = false;

	@Column(name = "is_active", nullable = false)
	private boolean active = true;
}
