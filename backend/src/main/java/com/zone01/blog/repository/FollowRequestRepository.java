package com.zone01.blog.repository;

import com.zone01.blog.entity.FollowRequest;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRequestRepository extends JpaRepository<FollowRequest, Long> {

    // Check if a specific follow request already exists between two users
    Optional<FollowRequest> findByRequesterAndTarget(User requester, User target);

    boolean existsByRequesterAndTarget(User requester, User target);

    // List all incoming pending requests for a private profile
    List<FollowRequest> findByTargetOrderByCreatedAtDesc(User target);

    List<FollowRequest> findByTarget(User target);

    // Count pending incoming requests for profile badge counter
    long countByTarget(User target);

    // Clean up when users are deleted
    void deleteAllByRequester(User requester);

    void deleteAllByTarget(User target);
}
