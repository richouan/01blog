package com.zone01.blog.repository;

import com.zone01.blog.entity.Notification;
import com.zone01.blog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // Retrieve notifications for a student ordered by newest first
    List<Notification> findByRecipientOrderByCreatedAtDesc(User recipient);

    // Count unread notifications to display on the navbar bell badge
    long countByRecipientAndIsReadFalse(User recipient);

    // Clean up notifications when deleting a user or clearing history
    void deleteAllByRecipient(User recipient);
    void deleteAllByActor(User actor);
}
