package com.zone01.blog.service;

import jakarta.annotation.PostConstruct;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
public class AvatarService {

    private static final int PRESET_COUNT = 10;
    private final Path avatarsDir = Paths.get("uploads", "avatars");

    // Curated SVG designs representing neo-brutalist developer characters
    private static final String[] BRUTALIST_SVGS = new String[]{
            // 1. Cyberpunk Hacker (Canary Yellow)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#FFE600"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <path d="M15 35 L50 12 L85 35 L85 42 L15 42 Z" fill="#121214"/>
              <rect x="22" y="38" width="56" height="46" rx="4" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <rect x="20" y="46" width="60" height="16" rx="2" fill="#121214"/>
              <rect x="25" y="50" width="22" height="8" fill="#00F0FF"/>
              <rect x="53" y="50" width="22" height="8" fill="#00F0FF"/>
              <path d="M40 72 Q50 78 60 72" stroke="#121214" stroke-width="3.5" fill="none" stroke-linecap="round"/>
              <rect x="26" y="66" width="6" height="6" fill="#FF5C5C" stroke="#121214" stroke-width="1.5"/>
            </svg>
            """,
            // 2. Retro Bot 01 (Neo Mint)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#00E599"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <line x1="50" y1="22" x2="50" y2="10" stroke="#121214" stroke-width="4"/>
              <circle cx="50" cy="9" r="6" fill="#FF5C5C" stroke="#121214" stroke-width="3"/>
              <rect x="20" y="24" width="60" height="58" rx="6" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <rect x="12" y="44" width="8" height="16" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <rect x="80" y="44" width="8" height="16" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <rect x="28" y="34" width="44" height="20" rx="3" fill="#121214"/>
              <circle cx="39" cy="44" r="4" fill="#00F0FF"/>
              <circle cx="61" cy="44" r="4" fill="#00F0FF"/>
              <rect x="36" y="62" width="28" height="10" fill="#FFE600" stroke="#121214" stroke-width="2.5"/>
              <line x1="43" y1="62" x2="43" y2="72" stroke="#121214" stroke-width="2"/>
              <line x1="50" y1="62" x2="50" y2="72" stroke="#121214" stroke-width="2"/>
              <line x1="57" y1="62" x2="57" y2="72" stroke="#121214" stroke-width="2"/>
            </svg>
            """,
            // 3. Arcade Pixel Punk (Coral Red)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#FF5C5C"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <polygon points="18,36 30,12 42,32 54,8 66,32 78,14 84,38" fill="#121214"/>
              <rect x="22" y="34" width="56" height="52" rx="4" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <rect x="26" y="44" width="20" height="16" rx="2" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <rect x="54" y="44" width="20" height="16" rx="2" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <line x1="46" y1="52" x2="54" y2="52" stroke="#121214" stroke-width="3"/>
              <circle cx="36" cy="52" r="3" fill="#121214"/>
              <circle cx="64" cy="52" r="3" fill="#121214"/>
              <line x1="32" y1="70" x2="42" y2="74" stroke="#121214" stroke-width="3"/>
              <line x1="32" y1="74" x2="42" y2="70" stroke="#121214" stroke-width="3"/>
              <path d="M52 70 Q60 74 68 68" stroke="#121214" stroke-width="3.5" fill="none" stroke-linecap="round"/>
            </svg>
            """,
            // 4. Glitch Ghost (Electric Lavender)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#A78BFA"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <path d="M22 84 L22 42 Q22 16 50 16 Q78 16 78 42 L78 84 L68 76 L58 84 L50 76 L42 84 L32 76 Z" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <circle cx="38" cy="42" r="9" fill="#121214"/>
              <circle cx="36" cy="40" r="3" fill="#FAF7F2"/>
              <circle cx="62" cy="42" r="9" fill="#121214"/>
              <circle cx="60" cy="40" r="3" fill="#FAF7F2"/>
              <circle cx="28" cy="54" r="4" fill="#FF70A6"/>
              <circle cx="72" cy="54" r="4" fill="#FF70A6"/>
              <ellipse cx="50" cy="58" rx="6" ry="8" fill="#FF5C5C" stroke="#121214" stroke-width="2.5"/>
            </svg>
            """,
            // 5. Code Ninja (Cyan Electric)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#00F0FF"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <rect x="18" y="20" width="64" height="66" rx="8" fill="#121214"/>
              <rect x="16" y="22" width="68" height="16" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <circle cx="50" cy="30" r="4" fill="#FF5C5C"/>
              <rect x="24" y="44" width="52" height="18" rx="2" fill="#FAF7F2" stroke="#121214" stroke-width="3"/>
              <polygon points="32,54 44,52 42,56" fill="#121214"/>
              <circle cx="38" cy="53" r="2.5" fill="#FF5C5C"/>
              <polygon points="68,54 56,52 58,56" fill="#121214"/>
              <circle cx="62" cy="53" r="2.5" fill="#FF5C5C"/>
            </svg>
            """,
            // 6. Cool Cat Hacker (Safety Orange)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#FF9900"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <polygon points="20,40 28,14 44,32" fill="#121214" stroke="#121214" stroke-width="2"/>
              <polygon points="26,36 30,22 38,32" fill="#FF5C5C"/>
              <polygon points="80,40 72,14 56,32" fill="#121214" stroke="#121214" stroke-width="2"/>
              <polygon points="74,36 70,22 62,32" fill="#FF5C5C"/>
              <rect x="20" y="32" width="60" height="54" rx="10" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <polygon points="22,46 48,46 44,58 26,58" fill="#121214"/>
              <polygon points="52,46 78,46 74,58 56,58" fill="#121214"/>
              <line x1="48" y1="50" x2="52" y2="50" stroke="#121214" stroke-width="3"/>
              <polygon points="50,64 47,61 53,61" fill="#FF5C5C"/>
              <path d="M44 68 Q50 72 50 67 Q50 72 56 68" stroke="#121214" stroke-width="2.5" fill="none"/>
              <line x1="14" y1="62" x2="22" y2="64" stroke="#121214" stroke-width="2.5"/>
              <line x1="14" y1="70" x2="22" y2="68" stroke="#121214" stroke-width="2.5"/>
              <line x1="86" y1="62" x2="78" y2="64" stroke="#121214" stroke-width="2.5"/>
              <line x1="86" y1="70" x2="78" y2="68" stroke="#121214" stroke-width="2.5"/>
            </svg>
            """,
            // 7. Astro Explorer (Sky Blue)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#70D6FF"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <circle cx="50" cy="50" r="34" fill="#FAF7F2" stroke="#121214" stroke-width="4"/>
              <rect x="26" y="36" width="48" height="26" rx="10" fill="#FFE600" stroke="#121214" stroke-width="3.5"/>
              <path d="M34 40 L46 40 L38 56 L30 56 Z" fill="#FAF7F2" opacity="0.8"/>
              <rect x="36" y="80" width="28" height="10" fill="#121214"/>
              <circle cx="20" cy="50" r="5" fill="#FF5C5C" stroke="#121214" stroke-width="2"/>
              <circle cx="80" cy="50" r="5" fill="#FF5C5C" stroke="#121214" stroke-width="2"/>
            </svg>
            """,
            // 8. Matrix Terminal (Cyber Night)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#121214"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#00E599" stroke-width="3"/>
              <rect x="18" y="16" width="64" height="56" rx="6" fill="#FAF7F2" stroke="#00E599" stroke-width="3.5"/>
              <rect x="24" y="22" width="52" height="44" rx="3" fill="#121214"/>
              <text x="30" y="44" font-family="monospace" font-size="16" font-weight="900" fill="#00E599">&gt;_</text>
              <rect x="52" y="32" width="8" height="14" fill="#00E599"/>
              <rect x="42" y="72" width="16" height="10" fill="#FAF7F2" stroke="#00E599" stroke-width="2.5"/>
              <rect x="32" y="82" width="36" height="6" fill="#FAF7F2" stroke="#00E599" stroke-width="2.5"/>
            </svg>
            """,
            // 9. Speed Demon (Hot Pink)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#FF70A6"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <polygon points="50,6 38,24 50,24 42,40 68,18 54,18" fill="#FFE600" stroke="#121214" stroke-width="3"/>
              <rect x="22" y="32" width="56" height="54" rx="4" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <polygon points="26,44 48,46 44,56 26,52" fill="#121214"/>
              <polygon points="52,46 74,44 74,52 56,56" fill="#121214"/>
              <line x1="48" y1="48" x2="52" y2="48" stroke="#121214" stroke-width="3"/>
              <rect x="36" y="66" width="28" height="10" rx="3" fill="#121214"/>
              <rect x="42" y="66" width="6" height="5" fill="#FFE600"/>
            </svg>
            """,
            // 10. Alien Dev (Volt Chartreuse)
            """
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100">
              <rect width="100" height="100" fill="#E2F952"/>
              <rect x="2" y="2" width="96" height="96" fill="none" stroke="#121214" stroke-width="4"/>
              <line x1="50" y1="26" x2="50" y2="14" stroke="#121214" stroke-width="3.5"/>
              <circle cx="50" cy="11" r="5" fill="#A78BFA" stroke="#121214" stroke-width="3"/>
              <ellipse cx="50" cy="54" rx="32" ry="28" fill="#FAF7F2" stroke="#121214" stroke-width="3.5"/>
              <circle cx="36" cy="46" r="6" fill="#121214"/>
              <circle cx="34" cy="44" r="2" fill="#FAF7F2"/>
              <circle cx="50" cy="42" r="7" fill="#121214"/>
              <circle cx="48" cy="40" r="2.5" fill="#FAF7F2"/>
              <circle cx="64" cy="46" r="6" fill="#121214"/>
              <circle cx="62" cy="44" r="2" fill="#FAF7F2"/>
              <path d="M40 64 Q50 76 60 64 Z" fill="#FF5C5C" stroke="#121214" stroke-width="2.5"/>
            </svg>
            """
    };

    @PostConstruct
    public void init() {
        try {
            if (!Files.exists(avatarsDir)) {
                Files.createDirectories(avatarsDir);
            }
            for (int i = 0; i < BRUTALIST_SVGS.length; i++) {
                Path filePath = avatarsDir.resolve("brutalist-" + (i + 1) + ".svg");
                if (!Files.exists(filePath)) {
                    Files.writeString(filePath, BRUTALIST_SVGS[i].trim(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
                }
            }
        } catch (IOException e) {
            System.err.println("Could not initialize preset brutalist avatars: " + e.getMessage());
        }
    }

    // Get list of all available preset avatar URLs
    public List<String> getPresetAvatarUrls() {
        List<String> list = new ArrayList<>();
        for (int i = 1; i <= PRESET_COUNT; i++) {
            list.add("/uploads/avatars/brutalist-" + i + ".svg");
        }
        return list;
    }

    // Pick a random preset avatar URL for new student registration
    public String getRandomAvatarUrl() {
        int index = ThreadLocalRandom.current().nextInt(PRESET_COUNT) + 1;
        return "/uploads/avatars/brutalist-" + index + ".svg";
    }

    // Deterministic fallback avatar based on username hash
    public String getFallbackAvatarForUsername(String username) {
        if (username == null || username.isBlank()) {
            return "/uploads/avatars/brutalist-1.svg";
        }
        int index = (Math.abs(username.hashCode()) % PRESET_COUNT) + 1;
        return "/uploads/avatars/brutalist-" + index + ".svg";
    }

    // Validate that a given URL is one of the built-in preset avatars
    public boolean isValidPreset(String url) {
        if (url == null || url.isBlank()) {
            return false;
        }
        return getPresetAvatarUrls().contains(url.trim());
    }
}
