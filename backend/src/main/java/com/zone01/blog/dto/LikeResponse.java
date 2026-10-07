package com.zone01.blog.dto;

public class LikeResponse {

    private Long postId;
    private boolean liked;
    private long likesCount;

    public LikeResponse() {}

    public LikeResponse(Long postId, boolean liked, long likesCount) {
        this.postId = postId;
        this.liked = liked;
        this.likesCount = likesCount;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public boolean isLiked() {
        return liked;
    }

    public void setLiked(boolean liked) {
        this.liked = liked;
    }

    public long getLikesCount() {
        return likesCount;
    }

    public void setLikesCount(long likesCount) {
        this.likesCount = likesCount;
    }
}
