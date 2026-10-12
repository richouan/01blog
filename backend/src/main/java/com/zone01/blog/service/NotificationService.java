package com.zone01.blog.service;

import com.zone01.blog.dto.NotificationResponse;
import com.zone01.blog.entity.Notification;
import com.zone01.blog.entity.NotificationType;
import com.zone01.blog.entity.Post;
import com.zone01.blog.entity.User;
import com.zone01.blog.repository.NotificationRepository;
import com.zone01.blog.repository.UserRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // Fetch all notifications for the authenticated user, newest first
    @Transactional(readOnly = true)
    public List<NotificationResponse> getUserNotifications(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return notificationRepository.findByRecipientOrderByCreatedAtDesc(user).stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    // Get count of unread notifications for badge counter
    @Transactional(readOnly = true)
    public long getUnreadCount(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        return notificationRepository.countByRecipientAndIsReadFalse(user);
    }

    // Mark an individual notification as read with ownership verification
    @Transactional
    public NotificationResponse markAsRead(@NonNull Long notificationId, String username) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new IllegalArgumentException("Notification not found with ID: " + notificationId));

        if (!notification.getRecipient().getUsername().equals(username)) {
            throw new SecurityException("You do not have permission to update this notification.");
        }

        notification.setRead(true);
        Notification saved = notificationRepository.save(notification);
        return NotificationResponse.fromEntity(saved);
    }

    // Mark all notifications as read for the user
    @Transactional
    public void markAllAsRead(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + username));

        List<Notification> unreadList = notificationRepository.findByRecipientOrderByCreatedAtDesc(user);
        for (Notification n : unreadList) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        notificationRepository.saveAll(unreadList);
    }

    // Trigger notifications to all followers when a student publishes a new post
    @Transactional
    public void notifyNewPost(Post post) {
        if (post == null || post.getAuthor() == null) {
            return;
        }

        User author = post.getAuthor();
        String message = author.getUsername() + " published a new post: \"" + post.getTitle() + "\"";

        for (User follower : author.getFollowers()) {
            if (!follower.getId().equals(author.getId())) {
                Notification notification = new Notification(
                        follower,
                        author,
                        NotificationType.NEW_POST,
                        message,
                        post.getId()
                );
                notificationRepository.save(notification);
            }
        }
    }

    // Trigger notification when student A follows student B
    @Transactional
    public void notifyNewFollower(User followed, User follower) {
        if (followed == null || follower == null || followed.getId().equals(follower.getId())) {
            return;
        }

        String message = follower.getUsername() + " started following your block";
        Notification notification = new Notification(
                followed,
                follower,
                NotificationType.NEW_FOLLOWER,
                message,
                follower.getId()
        );
        notificationRepository.save(notification);
    }
}
