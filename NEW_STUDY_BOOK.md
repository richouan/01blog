# 🎓 01Blog Bootcamp: Master Study Book

> **The Living Master Study Book for 01Blog**  
> Written from absolute ground zero for students preparing to defend their fullstack project during peer evaluation at Zone01.  
> Every concept is explained without hand-waving or unexplained jargon—starting from network bytes, operating system sockets, and JVM memory, leading all the way up to Spring Boot, Angular, and PostgreSQL.

---

# 📑 Master Table of Contents

- [Curriculum Roadmap](#-curriculum-roadmap)
- [Session 1: The Engine Under the Hood — From Network Bytes to Spring Boot](#session-1-the-engine-under-the-hood--from-network-bytes-to-spring-boot)
  - [Part 0: The Missing Foundations (Ground Zero)](#part-0-the-missing-foundations-ground-zero)
    - [1. What is an HTTP Request at the Physical Byte Level?](#1-what-is-an-http-request-at-the-physical-byte-level)
    - [2. Why Can't a Regular Java Program Hear This? (Why Tomcat Was Invented)](#2-why-cant-a-regular-java-program-hear-this-why-tomcat-was-invented)
    - [3. What on Earth is a "Servlet"?](#3-what-on-earth-is-a-servlet)
    - [4. The Invention of DispatcherServlet (The Front Desk Receptionist)](#4-the-invention-of-dispatcherservlet-the-front-desk-receptionist)
  - [Step 1: The Big Picture (How Everything Connects)](#step-1-the-big-picture-how-everything-connects)
    - [The Complete System Architecture Diagram](#the-complete-system-architecture-diagram)
    - [The 3 Core Backend Tiers & Separation of Concerns](#the-3-core-backend-tiers--separation-of-concerns)
  - [Step 2: Step-by-Step Flow (The Life of a Startup and a Request)](#step-2-step-by-step-flow-the-life-of-a-startup-and-a-request)
    - [Flow 1: The Startup Relay Race (From ./mvnw to Port 8080)](#flow-1-the-startup-relay-race-from-mvnw-to-port-8080)
    - [Startup Sequence Diagram (Mermaid)](#startup-sequence-diagram)
    - [Deep Technical Insight: Why the Program Doesn't Exit After main()](#deep-technical-insight-why-the-program-doesnt-exit-after-main)
    - [Flow 2: The Life of a Live HTTP Request (GET /api/posts)](#flow-2-the-life-of-a-live-http-request-get-apiposts)
  - [Step 3: How the Framework "Magic" Works](#step-3-how-the-framework-magic-works)
    - [1. What is Inversion of Control (IoC)?](#1-what-is-inversion-of-control-ioc)
    - [2. What is a "Bean" at the Memory Level?](#2-what-is-a-bean-at-the-memory-level)
    - [3. How Annotations and Reflection Work](#3-how-annotations-and-reflection-work)
    - [4. What is Constructor Dependency Injection?](#4-what-is-constructor-dependency-injection)
  - [Step 4: How the Syntax Works (Code Breakdown)](#step-4-how-the-syntax-works-code-breakdown)
    - [Anatomy of BlogApplication.java](#anatomy-of-blogapplicationjava)
    - [Anatomy of PostController.java](#anatomy-of-postcontrollerjava)
  - [Step 5: Summary to Explain to Others (Your Auditor Pitch)](#step-5-summary-to-explain-to-others-your-auditor-pitch)
  - [Interactive Q&A & Self-Check](#interactive-qa--self-check)
  - [🔬 Deep-Dive Q&A: Sockets, Servlets & The DispatcherServlet Under the Microscope](#-deep-dive-qa-sockets-servlets--the-dispatcherservlet-under-the-microscope)
    - [Q1: Where is the Servlet and DispatcherServlet in our project code?](#q1-where-is-the-servlet-and-dispatcherservlet-in-our-project-code)
    - [Q2: Real Example: Raw ASCII Bytes vs The HttpServletRequest Object](#q2-real-example-raw-ascii-bytes-vs-the-httpservletrequest-object)
    - [Q3: What is the Difference Between HttpServletRequest and HttpServletResponse?](#q3-what-is-the-difference-between-httpservletrequest-and-httpservletresponse)
    - [Q4: How Does DispatcherServlet Know Which Controller Matches an Endpoint?](#q4-how-does-dispatcherservlet-know-which-controller-matches-an-endpoint)
    - [Q5: What is the Physical Difference Between BeanFactory and ApplicationContext?](#q5-what-is-the-physical-difference-between-beanfactory-and-applicationcontext)
    - [Q6: Why are Spring Beans Singletons, and How Do 200 Tomcat Threads Share One Service Safely?](#q6-why-are-spring-beans-singletons-and-how-do-200-tomcat-threads-share-one-service-safely)
    - [Q7: Why Did We Use Constructor Injection Instead of @Autowired Field Injection?](#q7-why-did-we-use-constructor-injection-instead-of-autowired-field-injection)
    - [Q8: What is the 5-Stage Bean Lifecycle, and How Does DataInitializer.java Seed the Database on Boot?](#q8-what-is-the-5-stage-bean-lifecycle-and-how-does-datainitializerjava-seed-the-database-on-boot)
    - [Q9: What is the Secret Triad Inside @SpringBootApplication and How Does Component Scanning Work?](#q9-what-is-the-secret-triad-inside-springbootapplication-and-how-does-component-scanning-work)
    - [Q10: How Does @PreAuthorize Work at the Bytecode Level? (Spring AOP Dynamic Proxies)](#q10-how-does-preauthorize-work-at-the-bytecode-level-spring-aop-dynamic-proxies)
    - [Q11: The Evolution of Spring Configuration: What Was XML Configuration and Why Did Spring Boot Kill It?](#q11-the-evolution-of-spring-configuration-what-was-xml-configuration-and-why-did-spring-boot-kill-it)
    - [Q12: The Complete 6-Stage Bean Lifecycle: What is BeanPostProcessor and Where Are AOP Dynamic Proxies Born?](#q12-the-complete-6-stage-bean-lifecycle-what-is-beanpostprocessor-and-where-are-aop-dynamic-proxies-born)
    - [Q13: How Does Spring Inject Properties from .env and application.properties? (@Value and Environment)](#q13-how-does-spring-inject-properties-from-env-and-applicationproperties-value-and-environment)
    - [Q14: What Physically is a "Spring Boot Starter" in pom.xml?](#q14-what-physically-is-a-spring-boot-starter-in-pomxml)
    - [Q15: Comparing the Lifecycle of 3 Real Beans in 01Blog: CommentService vs AdminController vs DataInitializer](#q15-comparing-the-lifecycle-of-3-real-beans-in-01blog-commentservice-vs-admincontroller-vs-datainitializer)
- [Session 2: The Security Fortress — Deep Dive into Spring Security, JWT & Cryptography](#session-2-the-security-fortress--deep-dive-into-spring-security-jwt--cryptography)
  - [Part 0: The Missing Foundations & Why Spring Security Exists](#part-0-the-missing-foundations--why-spring-security-exists)
    - [1. Authentication vs Authorization (The ID vs The Keycard)](#1-authentication-vs-authorization-the-id-vs-the-keycard)
    - [2. How Tomcat Talks to Spring Security: DelegatingFilterProxy & FilterChainProxy](#2-how-tomcat-talks-to-spring-security-delegatingfilterproxy--filterchainproxy)
    - [3. Why Stateful Sessions Died & The Stateless Revolution](#3-why-stateful-sessions-died--the-stateless-revolution)
    - [4. Encryption vs Hashing (The One-Way Mathematical Trapdoor)](#4-encryption-vs-hashing-the-one-way-mathematical-trapdoor)
  - [Part 1: The Core Architecture of Spring Security in Memory](#part-1-the-core-architecture-of-spring-security-in-memory)
    - [1. The Three Russian Dolls: SecurityContextHolder, SecurityContext, and Authentication](#1-the-three-russian-dolls-securitycontextholder-securitycontext-and-authentication)
    - [2. The JVM Engine Room: How ThreadLocal Physically Works in RAM](#2-the-jvm-engine-room-how-threadlocal-physically-works-in-ram)
    - [3. The Roles & Authorities Engine (ROLE_ Prefix & GrantedAuthority)](#3-the-roles--authorities-engine-role_-prefix--grantedauthority)
  - [Part 2: The Security Filter Chain (The Bouncer Gauntlet)](#part-2-the-security-filter-chain-the-bouncer-gauntlet)
    - [1. The Exact Filter Chain Sequence & Order of Execution](#1-the-exact-filter-chain-sequence--order-of-execution)
    - [2. The Gatekeepers: AuthenticationEntryPoint (401) vs AccessDeniedHandler (403)](#2-the-gatekeepers-authenticationentrypoint-401-vs-accessdeniedhandler-403)
    - [3. The Shield at the Gate: In-Memory Rate Limiting & DoS Defense (RateLimitFilter)](#3-the-shield-at-the-gate-in-memory-rate-limiting--dos-defense-ratelimitfilter)
  - [Part 3: Web Defense Foundations: CORS & CSRF Unmasked](#part-3-web-defense-foundations-cors--csrf-unmasked)
    - [1. CORS: Same-Origin Policy & Preflight OPTIONS Requests](#1-cors-same-origin-policy--preflight-options-requests)
    - [2. CSRF: The Cookie Exploitation Attack & Why Stateless JWTs Are Immune](#2-csrf-the-cookie-exploitation-attack--why-stateless-jwts-are-immune)
  - [Part 4: Cryptography Deep Dive: BCrypt & JWT Under the Microscope](#part-4-cryptography-deep-dive-bcrypt--jwt-under-the-microscope)
    - [1. Inside BCrypt: Salting, Blowfish Cipher & The Cost Factor](#1-inside-bcrypt-salting-blowfish-cipher--the-cost-factor)
    - [2. Inside JWT: Base64Url Bitwise Encoding, Claims & HMAC-SHA256 Seals](#2-inside-jwt-base64url-bitwise-encoding-claims--hmac-sha256-seals)
  - [Part 5: Syntax Breakdown of Project Code](#part-5-syntax-breakdown-of-project-code)
    - [Anatomy of SecurityConfig.java](#anatomy-of-securityconfigjava)
    - [Anatomy of RateLimitFilter.java](#anatomy-of-ratelimitfilterjava)
    - [Anatomy of JwtAuthFilter.java & The Banned User Lockdown](#anatomy-of-jwtauthfilterjava--the-banned-user-lockdown)
    - [Anatomy of JwtUtil.java](#anatomy-of-jwtutiljava)
    - [Anatomy of AuthService.java (Bootstrap Admin & Password Verification)](#anatomy-of-authservicejava-bootstrap-admin--password-verification)
  - [Part 6: Summary to Explain to Others (Your Auditor Pitch)](#part-6-summary-to-explain-to-others-your-auditor-pitch)
  - [Interactive Q&A & Self-Check for Session 2](#interactive-qa--self-check-for-session-2)
  - [🔬 Deep-Dive Q&A: Filter Ordering Mechanics, ThreadLocal Lifecycles & Integer Sorting](#-deep-dive-qa-filter-ordering-mechanics-threadlocal-lifecycles--integer-sorting)
    - [Q1: What Physically is filterChain.doFilter(request, response)?](#q1-what-physically-is-filterchaindofilterrequest-response)
    - [Q2: How Does Spring Know the Exact Order of Built-in Filters? (The FilterOrderRegistration Integer Sorting System)](#q2-how-does-spring-know-the-exact-order-of-built-in-filters-the-filterorderregistration-integer-sorting-system)
    - [Q3: The Paradox Resolved: Session Memory vs Request Memory](#q3-the-paradox-resolved-session-memory-vs-request-memory)
    - [Q4: Why is UsernamePasswordAuthenticationFilter in the Chain if We Use JWT?](#q4-why-is-usernamepasswordauthenticationfilter-in-the-chain-if-we-use-jwt)
    - [Q5: What Does "Spring MVC" Mean in a REST API, and Why Does .anyRequest().permitAll() Enable Clean 404s?](#q5-what-does-spring-mvc-mean-in-a-rest-api-and-why-does-anyrequestpermitall-enable-clean-404s)
    - [Q6: Why is RateLimitFilter Placed Before LogoutFilter Instead of After JwtAuthFilter?](#q6-why-is-ratelimitfilter-placed-before-logoutfilter-instead-of-after-jwtauthfilter)
    - [Q7: How Does RateLimitFilter Prevent Memory Leaks in JVM RAM When Tracking Client IPs?](#q7-how-does-ratelimitfilter-prevent-memory-leaks-in-jvm-ram-when-tracking-client-ips)
    - [Q8: How Does VirtualFilterChain Physically Pass the Baton in Memory? (The currentPosition Counter)](#q8-how-does-virtualfilterchain-physically-pass-the-baton-in-memory-the-currentposition-counter)
    - [Q9: Why Does doFilterInternal Declare "throws ServletException, IOException"? (throw vs throws)](#q9-why-does-dofilterinternal-declare-throws-servletexception-ioexception-throw-vs-throws)

---

# 🗺️ Curriculum Roadmap

| Session | Title | Focus Areas | Status |
|---|---|---|---|
| **Session 1** | **The Engine Under the Hood** | Sockets, Tomcat, IoC Container, Beans, DI, Reflection, DispatcherServlet | **COMPLETED & DOCUMENTED** |
| **Session 2** | **The Security Fortress** | Spring Security Architecture, ThreadLocal Context, Stateless JWT, BCrypt, CORS, CSRF, Ban Lockdown | **COMPLETED & DOCUMENTED** |
| **Session 3** | **The Persistence Layer** | JPA, Hibernate, @ManyToMany Subscriptions, Composite Keys, N+1 Prevention | *NEXT UP* |
| **Session 4** | **Media Uploads & OS Safety** | Apache Tika Magic Bytes, UUID File Renaming, Path Traversal Guards | *PENDING* |
| **Session 5** | **The Angular Client Machine** | Standalone Components, RxJS State, Interceptors, Optimistic UI | *PENDING* |
| **Session 6** | **System Governance & Defense** | Cascade Deletions, Global Error Contracts, Mock Audit Defense Drill | *PENDING* |

---

# Session 1: The Engine Under the Hood — From Network Bytes to Spring Boot

Before examining Spring Boot code, we must understand how a computer physically communicates with a web browser. If an auditor asks:  
*"What actually happens when a user clicks a button?"*, you cannot simply say *"Spring handles it."* You must explain it from the network wires up.

---

## Part 0: The Missing Foundations (Ground Zero)

### 1. What is an HTTP Request at the Physical Byte Level?

When you open your browser (or when Angular runs) and triggers `GET http://localhost:8080/api/posts`, no Java objects exist on the wire.

1. **The Operating System Network Stack:**  
   Your operating system (Windows or Linux) breaks your intent down into an electrical/packet level. It opens a **TCP (Transmission Control Protocol) Socket**.
2. **What is a Socket?**  
   A socket is a digital 2-way pipe managed by the OS kernel. One end is at IP `127.0.0.1` on an arbitrary ephemeral port (e.g. `54321`), and the other end connects to IP `127.0.0.1` on port `8080`.
3. **What travels through this pipe?**  
   **Raw ASCII text bytes.** Nothing more. If you hooked up an oscilloscope or packet sniffer (like Wireshark), you would see:

```http
GET /api/posts HTTP/1.1\r\n
Host: localhost:8080\r\n
User-Agent: Mozilla/5.0\r\n
Authorization: Bearer eyJhbGciOiJIUzI1Ni...
Accept: application/json\r\n
\r\n
```

* `\r\n` (Carriage Return + Line Feed) separates each header line.
* A double `\r\n\r\n` tells the receiver: *"The headers are finished, the body begins now."*

---

### 2. Why Can't a Regular Java Program Hear This? (Why Tomcat Was Invented)

A standard Java console app (like `public static void main(String[] args)`) executes line by line, prints to standard output, and terminates. It has **no ears**. It cannot interact with the network card.

To listen to network traffic, a program must execute low-level OS system calls:
* `socket()`: Ask the OS kernel to create a network communication endpoint.
* `bind(8080)`: Claim ownership of port `8080`.
* `listen()`: Tell the OS kernel: *"Queue up any incoming TCP connections."*
* `accept()`: Block and wait until a client connects, then spawn a worker thread to read the incoming byte stream.

Writing code that handles socket buffers, manages a thread pool for hundreds of concurrent connections, handles connection timeouts, and parses HTTP headers requires thousands of lines of low-level boilerplate.

**That is why Apache Tomcat was created.**  
Tomcat is a specialized web server program written in Java. Its entire purpose in life is:
1. Bind to port `8080`.
2. Manage a **Worker Thread Pool** (e.g. 200 concurrent worker threads).
3. Catch raw TCP byte streams from incoming connections.
4. Parse those raw ASCII bytes into a structured Java object.

---

### 3. What on Earth is a "Servlet"?

In the late 1990s, Java engineers had a dilemma:  
Tomcat knew how to parse network bytes into Java, but **Tomcat knew nothing about your business logic** (your blog posts, users, or passwords).

Sun Microsystems created a standard Java interface called a **Servlet** (short for *"Server Applet"*):

```java
package jakarta.servlet;

public interface Servlet {
    void service(ServletRequest request, ServletResponse response) 
        throws ServletException, IOException;
}
```

#### How it works:
1. Tomcat parses the raw HTTP text and packages it into an `HttpServletRequest` object (containing method, headers, parameters, and body input stream).
2. Tomcat creates an empty `HttpServletResponse` object (with an output stream connected back to the client's socket).
3. Tomcat calls:
   ```java
   myServlet.service(request, response);
   ```
4. Inside `service()`, the developer writes back to `response.getOutputStream().write(...)`.
5. Tomcat flushes those bytes across the TCP socket back to the browser.

#### The Problem with Early Servlets:
In legacy Java, if your app had 50 endpoints (`/login`, `/register`, `/api/posts`, `/api/comments`, etc.), you had to create 50 separate Servlet classes and map each URL manually in an XML file called `web.xml`. It was repetitive, rigid, and painful to maintain.

---

### 4. The Invention of `DispatcherServlet` (The Front Desk Receptionist)

Spring revolutionized Java by introducing a pattern called the **Front Controller**.  
Spring said:  
> *"Stop writing dozens of Servlets. We will provide **ONE master Servlet** to rule them all: the `DispatcherServlet`."*

#### The Hotel Analogy:
* Imagine a luxury hotel.
* Guests (HTTP requests) do **not** roam the hallways knocking on the doors of individual chefs (`PostController`), accountants (`AuthController`), or security officers (`SecurityConfig`).
* All guests walk through the main revolving door and speak to the **Front Desk Receptionist (`DispatcherServlet`)**.
* The Receptionist holds a master registry (`HandlerMapping`).
* When you say *"I want to view posts"*, the receptionist looks at the book, dials the kitchen (`PostController.getAllPosts()`), collects the food (data), wraps it neatly (JSON), and hands it to you.

---

## Step 1: The Big Picture (How Everything Connects)

### The Complete System Architecture Diagram

![01Blog System Architecture & End-to-End Request Highway](docs/images/01blog_architecture_overview.jpg)

```
┌────────────────────────────────────────────────────────┐
│             Angular 18 Frontend Client                 │
│         (Browser at http://localhost:4200)             │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 1. HTTP Request over TCP Socket (Port 8080)
                            ▼
┌────────────────────────────────────────────────────────┐
│             Linux / Windows OS Kernel                  │
│       Delivers TCP packets to listening port 8080      │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 2. Hands raw byte stream to listening thread
                            ▼
┌────────────────────────────────────────────────────────┐
│         Embedded Apache Tomcat (Web Server)            │
│  - Reads raw text bytes                                │
│  - Builds HttpServletRequest & HttpServletResponse     │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 3. Passes request through the Filter Chain
                            ▼
┌────────────────────────────────────────────────────────┐
│         Spring Security Filter Chain                   │
│  - RateLimitFilter: Checks IP limit (120 req/min)      │
│  - JwtAuthFilter: Validates cryptographic signature    │
│  - Banned User Check: Blocks banned accounts           │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 4. Forwards validated request to Servlet entry
                            ▼
┌────────────────────────────────────────────────────────┐
│          DispatcherServlet (Front Controller)          │
│  - Consults HandlerMapping: "Who owns GET /api/posts?" │
│  - Finds: PostController.getAllPosts()                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 5. Executes matched controller method
                            ▼
┌────────────────────────────────────────────────────────┐
│        PostController (Web Layer / Waiter)             │
│  - Extracts HTTP headers, DTOs, query parameters       │
│  - Invokes PostService                                 │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 6. Calls business logic
                            ▼
┌────────────────────────────────────────────────────────┐
│         PostService (Business Layer / Chef)            │
│  - Enforces rules: character limits, permissions       │
│  - Calls PostRepository                                │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 7. Asks for persistence operations
                            ▼
┌────────────────────────────────────────────────────────┐
│      PostRepository (Data Layer / Spring Data JPA)     │
│  - Dynamic Proxy translates method name to SQL         │
│  - Uses HikariCP connection pool                       │
└───────────────────────────┬────────────────────────────┘
                            │
                            │ 8. Sends SQL query over Port 5432
                            ▼
┌────────────────────────────────────────────────────────┐
│          PostgreSQL 16 Database (Disk Engine)          │
│  - Executes SQL: SELECT * FROM posts ORDER BY ...      │
│  - Returns tabular record rows                         │
└────────────────────────────────────────────────────────┘
```

---

### The 3 Core Backend Tiers & Separation of Concerns

1. **Controller Layer (`PostController.java`)**:
   - Sole responsibility: **HTTP Protocol Translation**.
   - Accepts parameters, maps request bodies, calls service methods, and sets the HTTP status code (`200 OK`, `201 CREATED`, `400 BAD REQUEST`, `403 FORBIDDEN`, `404 NOT FOUND`).
   - It **never** contains direct database queries or business validation rules.
2. **Service Layer (`PostService.java`)**:
   - Sole responsibility: **Business Rules & Logic**.
   - Enforces business invariants: Is this user banned? Is the uploaded file a genuine JPEG/PNG? Does this post violate length constraints (max 20,000 characters)?
3. **Repository Layer (`PostRepository.java`)**:
   - Sole responsibility: **Database Interaction**.
   - Connects to PostgreSQL, executes queries, and converts relational SQL rows into Java entity objects.

---

## Step 2: Step-by-Step Flow (The Life of a Startup and a Request)

### Flow 1: The Startup Relay Race (From `./mvnw` to Port 8080)

![01Blog The 5-Runner Startup Relay Race](docs/images/01blog_startup_relay_race.jpg)

When you run `.\mvnw.cmd spring-boot:run` (or `./mvnw spring-boot:run`), a 5-runner relay race begins:

```
[ Runner 1: Maven Wrapper (mvnw) ]
       │
       ▼ Passes Classpath & dependencies
[ Runner 2: Java Virtual Machine (JVM) ]
       │
       ▼ Executes BlogApplication.main()
[ Runner 3: Custom Environment Loader (loadDotenv) ]
       │
       ▼ Injects DB & JWT secrets into System.properties
[ Runner 4: Spring IoC Container Engine ]
       │
       ▼ Scans classes, creates Beans, connects DB pool
[ Runner 5: Embedded Apache Tomcat Server ]
       │
       ▼ Binds port 8080, registers DispatcherServlet, starts worker threads
```

#### Detailed Sequence:
1. **Maven Wrapper**: Verifies all JAR dependencies in `~/.m2/repository/` (Spring Web, Spring Security, Hibernate, PostgreSQL driver, Tomcat embedded). It compiles `.java` files into `.class` bytecode in `target/classes/`.
2. **JVM Launch**: Maven invokes:
   ```bash
   java -cp "target/classes;all_downloaded_jars..." com.zone01.blog.BlogApplication
   ```
3. **`BlogApplication.main()` is invoked**: The very first line executed is our custom method:
   ```java
   loadDotenv();
   ```
   It reads `.env` line by line, splits by `=`, and stores values (`DB_URL`, `JWT_SECRET`) directly into Java's in-memory `System.setProperty()`. This allows `application.properties` to read them via `${DB_URL}` without hardcoding secrets in Git.
4. **Spring Container Ignition (`SpringApplication.run`)**:
   Spring creates the **`ApplicationContext`** (the IoC container).
   - It performs **Component Scanning** across `com.zone01.blog`.
   - It finds `@Repository`, `@Service`, `@RestController`, and `@Configuration` classes.
   - It instantiates them and wires them together via **Constructor Injection**.
5. **Database Connection Pool (HikariCP)**:
   Spring initializes HikariCP. It opens a pool of persistent, open TCP connections to PostgreSQL on port `5432`.
6. **Embedded Tomcat Instantiation**:
   Spring checks the classpath. Because `spring-boot-starter-web` is included, Spring finds `org.apache.catalina.startup.Tomcat`.
   It programmatically creates an instance:
   ```java
   Tomcat tomcat = new Tomcat();
   tomcat.setPort(8080);
   tomcat.addServlet(context, "dispatcherServlet", new DispatcherServlet(appContext));
   tomcat.start();
   ```
7. **Thread Locking**:
   Tomcat starts non-daemon background listener threads. **In Java, the JVM cannot shut down as long as at least one non-daemon thread is alive.** That is why `main()` reaches its closing brace, but the application keeps running indefinitely!

---

### Startup Sequence Diagram

```mermaid
sequenceDiagram
    autonumber
    actor Dev as You (Terminal)
    participant Maven as Maven (mvnw)
    participant JVM as JVM (java process)
    participant App as BlogApplication.main()
    participant Spring as Spring IoC Container
    participant DB as PostgreSQL (Port 5432)
    participant Tomcat as Embedded Tomcat Engine
    participant OS as OS Kernel (Port 8080)

    Dev->>Maven: ./mvnw spring-boot:run
    Note over Maven: 1. Compiles Java files<br/>2. Resolves JAR dependencies<br/>3. Constructs the Classpath
    Maven->>JVM: java -cp "target/classes:all_jars..." com.zone01.blog.BlogApplication
    JVM->>App: Executes main()
    App->>App: loadDotenv() -> registers .env into System.properties
    App->>Spring: SpringApplication.run(BlogApplication.class)
    
    Note over Spring: Spring scans com.zone01.blog:<br/>Discovers & creates Beans (@Service, @Repository, @Controller)
    Spring->>DB: Initializes HikariCP Connection Pool
    
    Note over Spring, Tomcat: Programmatic Tomcat Initialization
    Spring->>Tomcat: new Tomcat()
    Spring->>Tomcat: tomcat.setPort(8080)
    Spring->>Tomcat: tomcat.addServlet("dispatcherServlet", new DispatcherServlet())
    Spring->>Tomcat: tomcat.start()
    
    Tomcat->>OS: bind(port 8080) & listen()
    OS-->>Tomcat: Port 8080 opened successfully!
    
    Note over Tomcat, OS: Tomcat starts non-daemon worker threads.<br/>Application stays alive waiting for requests.
```

---

### Deep Technical Insight: Why the Program Doesn't Exit After `main()`

In basic Java, once `main()` finishes its last line, the program terminates.  
Why doesn't Spring Boot terminate?

* **Daemon vs Non-Daemon Threads in Java:**
  - When a Java thread is marked as a **daemon** thread, the JVM doesn't care if it's running; when all user threads stop, the JVM kills all daemons and shuts down.
  - When a thread is marked as **non-daemon** (user thread), the JVM rule is absolute: **The JVM will NEVER terminate as long as even one non-daemon thread is alive.**
* Tomcat creates worker threads (like `http-nio-8080-exec-1`, `http-nio-8080-Acceptor`) as **non-daemon threads**.
* These threads block on the OS `accept()` system call, waiting for incoming TCP packets on port 8080.
* Therefore, the JVM remains actively idling, ready to handle incoming requests indefinitely.

---

### Flow 2: The Life of a Live HTTP Request (`GET /api/posts`)

Here are the exact 13 chronological steps that occur when a user views the post feed:

1. **Browser/Angular**: Angular's `HttpClient` makes a request: `GET /api/posts` with header `Authorization: Bearer <jwt>`.
2. **OS Kernel**: Catches TCP packets arriving at port 8080 and delivers them to Tomcat's listening socket.
3. **Tomcat Acceptor Thread**: Accepts connection, parses the raw ASCII text, and builds `HttpServletRequest` and `HttpServletResponse` objects.
4. **Security Filter Chain**:
   - `RateLimitFilter`: Looks at client IP address. If it exceeds 120 requests/minute, it immediately returns `429 Too Many Requests` without touching controllers.
   - `JwtAuthFilter`: Validates the cryptographic signature of the token, loads user details, checks if the account is banned (`isBanned == true`), and registers authentication in `SecurityContextHolder`.
5. **`DispatcherServlet`**: The Front Desk receives the request, searches its `HandlerMapping`, and finds that `GET /api/posts` maps to `PostController.getAllPosts()`.
6. **`PostController`**: Extracts the current authenticated username from `Authentication.getName()` and calls `postService.getAllPosts(username)`.
7. **`PostService`**: Enforces business rules (e.g., filters out hidden posts) and calls `postRepository.findAllByOrderByCreatedAtDesc()`.
8. **`PostRepository`**: A Spring Data JPA dynamic proxy generates the SQL query:
   ```sql
   SELECT * FROM posts ORDER BY created_at DESC;
   ```
9. **PostgreSQL 16**: Executes the query over connection socket 5432 and returns binary rows.
10. **Hibernate/JPA**: Hydrates database rows into Java `Post` entity instances.
11. **DTO Mapping & Jackson Serialization**: `PostService` converts entities into `PostResponse` DTOs. Jackson inspects their getters and converts the Java list into JSON text:
    ```json
    [{"id":1,"title":"Hello World","authorUsername":"student1"}]
    ```
12. **Tomcat**: Assembles HTTP response headers (`HTTP/1.1 200 OK`, `Content-Type: application/json`) and writes the JSON bytes across the TCP pipe.
13. **Angular**: Receives the response, updates the RxJS observable/signal, and renders post cards on the page.

---

## Step 3: How the Framework "Magic" Works

### 1. What is Inversion of Control (IoC)?

In standard Java, you control object creation:
```java
// Traditional style: You are in control
PostRepository repo = new PostRepositoryImpl();
PostService service = new PostService(repo);
PostController controller = new PostController(service);
```
**Problems with this:**
* If 15 classes need `UserRepository`, you might accidentally instantiate 15 separate database connections.
* Testing is painful because components are tightly coupled.

**Inversion of Control (IoC):**  
We surrender the control of object lifecycles to Spring.
* Spring instantiates the objects.
* Spring holds them in memory.
* Spring supplies them to whichever class demands them.

---

### 2. What is a "Bean" at the Memory Level?

* A **Bean** is nothing more than a normal Java object that is created, configured, and managed inside Spring's IoC container (`ApplicationContext`).
* In heap memory, a Bean is a standard Java object reference held in a concurrent hash map inside Spring's `DefaultListableBeanFactory`.
* By default, all Spring Beans are **Singletons**: Spring creates **only one single instance** of `PostService` in RAM for the entire lifetime of the backend, and shares that single instance across all requests and controllers.

---

### 3. How Annotations and Reflection Work

An annotation like `@RestController` or `@Service` contains **zero executable logic**. It is simply metadata attached to a class (like a barcode on a grocery item).

#### How Spring reads annotations: **Java Reflection**
Reflection is a feature of Java that allows code to inspect its own bytecode at runtime:

```java
// Conceptual view of Spring's internal scanner:
Class<?> clazz = Class.forName("com.zone01.blog.controller.PostController");

if (clazz.isAnnotationPresent(RestController.class)) {
    // 1. Spring realizes this is a web controller!
    Constructor<?> constructor = clazz.getConstructors()[0];
    
    // 2. Spring inspects parameters: PostService, LikeService
    Class<?>[] paramTypes = constructor.getParameterTypes();
    
    // 3. Spring pulls PostService and LikeService Beans from its warehouse
    Object serviceBean = iocContainer.getBean(paramTypes[0]);
    Object likeBean = iocContainer.getBean(paramTypes[1]);
    
    // 4. Spring instantiates PostController using reflection!
    Object controllerInstance = constructor.newInstance(serviceBean, likeBean);
    
    // 5. Spring inspects methods for @GetMapping, @PostMapping
    for (Method method : clazz.getDeclaredMethods()) {
        if (method.isAnnotationPresent(GetMapping.class)) {
            // Registers route in DispatcherServlet's HandlerMapping!
        }
    }
}
```

You never write a `switch-case` statement to handle URLs. Spring's reflection engine constructs the routing map automatically during boot.

---

### 4. What is Constructor Dependency Injection?

When a class needs another class to do its job, it declares that dependency in its constructor:

```java
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final LikeService likeService;

    // Spring sees this constructor and injects the singleton Beans
    public PostController(PostService postService, LikeService likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }
}
```

#### Why Constructor Injection is best practice:
1. **Immutability (`final`)**: The fields are marked `final`. Once Spring sets them at startup, they can never be modified or set to `null` accidentally.
2. **No `@Autowired` needed**: Since Spring 4.3, if a class has a single constructor, Spring automatically injects dependencies without needing any annotation.
3. **Easy Testing**: You can write a unit test in plain Java (`new PostController(mockService, mockLikeService)`) without even booting Spring!

---

## Step 4: How the Syntax Works (Code Breakdown)

### Anatomy of `BlogApplication.java`

```java
package com.zone01.blog;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@SpringBootApplication
public class BlogApplication {

    public static void main(String[] args) {
        loadDotenv();
        SpringApplication.run(BlogApplication.class, args);
    }
```

* **`@SpringBootApplication`**: A composite annotation packaging 3 core features:
  1. `@Configuration`: Marks this class as a source of Bean definitions.
  2. `@EnableAutoConfiguration`: Tells Spring to inspect dependencies in `pom.xml`. Since Tomcat and PostgreSQL drivers are detected, auto-configure them.
  3. `@ComponentScan`: Tells Spring to scan the current package (`com.zone01.blog`) and all child packages (`controller`, `service`, `repository`, `config`) to discover all annotated classes.
* **`loadDotenv();`** (Lines 20–34):
  ```java
  Path path = Files.exists(Paths.get(".env")) ? Paths.get(".env") : Paths.get("../.env");
  ```
  Finds `.env` whether you run from project root or `backend/`. Splits each key-value pair (`DB_URL=...`) and registers it in `System.setProperty(key, val)` so `application.properties` can safely reference `${DB_URL}` without storing passwords in Git.
* **`SpringApplication.run(BlogApplication.class, args);`**:
  Initializes the `ApplicationContext`, performs component scanning, binds Tomcat to port `8080`, and starts listening for HTTP traffic.

---

### Anatomy of `PostController.java`

```java
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final LikeService likeService;

    public PostController(PostService postService, LikeService likeService) {
        this.postService = postService;
        this.likeService = likeService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> createPost(
            @RequestParam(name = "title", required = true) String title,
            @RequestParam(name = "textContent", required = false) String textContent,
            @RequestParam(name = "file", required = false) MultipartFile file,
            Authentication authentication
    ) {
```

* **`@RestController`**: Combines `@Controller` and `@ResponseBody`. Tells Spring: *"Whatever this class returns should not be rendered as an HTML template; instead, serialize the return object directly into JSON text using Jackson."*
* **`@RequestMapping("/api/posts")`**: Base path prefix for all endpoints in this class.
* **`@PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)`**:
  Tells `DispatcherServlet` to route `POST /api/posts` here only when the `Content-Type` is `multipart/form-data` (which is necessary when sending binary images/videos alongside text fields).
* **`@RequestParam`**: Instructs Spring to pull specific form fields (`title`, `textContent`, `file`) from the incoming multipart body.
* **`Authentication authentication`**: Injected automatically by Spring Security from the `SecurityContextHolder`. Contains the authenticated user's credentials and username parsed from the JWT.
* **`ResponseEntity<?>`**: A complete HTTP response wrapper allowing us to explicitly configure the HTTP status code (e.g. `201 CREATED`, `400 BAD REQUEST`, `403 FORBIDDEN`) and the response body.

---

## Step 5: Summary to Explain to Others (Your Auditor Pitch)

When an auditor asks:  
**"Explain how your backend boots up and how an HTTP request actually reaches your code."**

Here is your exact pitch:

> *"Our backend is built on Java using Spring Boot with an embedded Apache Tomcat server listening on port 8080.  
> 
> When `BlogApplication.main()` executes, it first invokes our custom `loadDotenv()` method, which parses our `.env` file directly into Java system properties so database and JWT secrets remain secure and out of version control.  
> 
> Next, `SpringApplication.run()` ignites the Spring IoC container. Through component scanning, Spring inspects our bytecode via reflection, discovers classes annotated with `@RestController`, `@Service`, `@Repository`, and `@Configuration`, instantiates them as singleton Beans, and wires them together using Constructor Dependency Injection. It also initializes the HikariCP database connection pool to PostgreSQL.  
> 
> Because `spring-boot-starter-web` is on the classpath, Spring programmatically instantiates an embedded Apache Tomcat server, binds it to TCP port 8080 via the OS network stack, and hooks in the `DispatcherServlet` as the central front controller.  
> 
> When an Angular client makes a request like `GET /api/posts`, Tomcat parses the raw TCP byte stream into an `HttpServletRequest` and passes it through our Spring Security filter chain (`RateLimitFilter` for DoS protection and `JwtAuthFilter` for authentication).  
> 
> Once approved, `DispatcherServlet` matches the path to `PostController.getAllPosts()` using its internal handler mapping. The controller invokes `PostService` for business validation, which queries PostgreSQL via our `PostRepository` Spring Data JPA interface. Finally, Jackson serializes the returned Java objects into JSON text, and Tomcat flushes the HTTP 200 response back across the socket to the client."*

---

## Interactive Q&A & Self-Check

Before you move to Session 2, test yourself on these questions that evaluators frequently ask:

1. **Why doesn't our Java program exit after `main()` reaches the last line? What physically keeps it running?**  
   *Answer:* Tomcat starts non-daemon worker threads that listen to TCP port 8080. In the Java Virtual Machine, as long as at least one non-daemon thread is alive, the JVM is forbidden from terminating.

2. **What is a "Spring Bean" at the memory level, and why do we prefer Constructor Injection over `new PostService()`?**  
   *Answer:* A Bean is a normal Java object instance managed as a singleton inside Spring's `ApplicationContext` memory map. Constructor Injection ensures immutability (fields can be marked `final`), allows easy unit testing with mocks, and eliminates circular dependency pitfalls.

3. **What is the difference between Tomcat and `DispatcherServlet`?**  
   *Answer:* Tomcat is the low-level HTTP web server that opens the network socket and parses raw bytes into `HttpServletRequest`. `DispatcherServlet` is the Spring master servlet (the front desk receptionist) that routes that request to our specific `@RestController` method.

4. **Why do we use an interface for `PostRepository` instead of writing an implementation class with SQL?**  
   *Answer:* Spring Data JPA uses dynamic reflection proxies at startup to automatically generate the implementation class and convert method names (like `findByTitle`) into SQL queries without us having to write JDBC boilerplate.

---

## 🔬 Deep-Dive Q&A: Sockets, Servlets & The DispatcherServlet Under the Microscope

![01Blog Network Bytes, Servlet Mechanics & DispatcherServlet Routing](docs/images/01blog_servlet_dispatch_routing.jpg)

### Q1: Where is the Servlet and `DispatcherServlet` in our project code?
You will not find `DispatcherServlet.java` inside `src/main/java/com/zone01/blog/` because **we did not write it. The Spring Framework engineering team wrote it, compiled it, and packaged it inside a library JAR!**

In `backend/pom.xml`, we include:
```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
```
This dependency pulls `spring-webmvc-6.x.jar`, which contains `org.springframework.web.servlet.DispatcherServlet.class`.  
At startup, Spring Boot's `DispatcherServletAutoConfiguration` programmatically instantiates:
```java
DispatcherServlet dispatcher = new DispatcherServlet(applicationContext);
Tomcat.addServlet(context, "dispatcherServlet", dispatcher);
context.addServletMappingDecoded("/", "dispatcherServlet");
```
The mapping `"/"` instructs Tomcat: *"Hand every single incoming HTTP request on port 8080 directly to DispatcherServlet."*

You can see and touch the raw Servlet API directly in our own code in `JwtAuthFilter.java`:
```java
import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, IOException { ... }
```

---

### Q2: Real Example: Raw ASCII Bytes vs The `HttpServletRequest` Object

#### The Raw Bytes Sent over TCP Socket:
When an Angular client posts a comment, the network cable transmits raw ASCII bytes:
```http
POST /api/posts/5/comments HTTP/1.1\r\n
Host: localhost:8080\r\n
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\r\n
Content-Type: application/json\r\n
Content-Length: 32\r\n
\r\n
{"content":"Great explanation!"}
```

#### How Tomcat Hydrates the Java Object:
Tomcat reads these bytes via `socketChannel.read()` and instantiates an `HttpServletRequest`:
```text
HttpServletRequest Object in JVM Heap Memory:
├── method        = "POST"
├── requestURI    = "/api/posts/5/comments"
├── headers = {
│     "host"          : "localhost:8080",
│     "authorization" : "Bearer eyJhbGciOi...",
│     "content-type"  : "application/json"
│   }
└── inputStream   = [Bytes: '{"content":"Great explanation!"}']
```
Instead of manually splitting strings or writing regexes, our code queries structured methods: `request.getHeader("Authorization")` and `request.getMethod()`.

---

### Q3: What is the Difference Between `HttpServletRequest` and `HttpServletResponse`?

| Attribute | `HttpServletRequest` | `HttpServletResponse` |
|---|---|---|
| **Role** | The **Inbound Envelope** (Input) | The **Outbound Letter** (Output) |
| **Direction** | Browser ➔ Server | Server ➔ Browser |
| **Physical Socket** | Bound to Socket's **InputStream** (read) | Bound to Socket's **OutputStream** (write) |
| **Who Writes It?** | The Client (Angular/Browser) | Your Backend Code / Spring Boot |
| **Key Methods** | `request.getMethod()`<br>`request.getHeader(...)`<br>`request.getInputStream()` | `response.setStatus(200 / 403)`<br>`response.setContentType(...)`<br>`response.getWriter().write(...)` |

In `JwtAuthFilter.java`, when a banned user is detected:
```java
// 1. We READ from the request (extracting the user's token)
// 2. We WRITE to the response:
response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403
response.setContentType("application/json");
response.getWriter().write("{\"error\":\"ACCOUNT_BANNED\"}");
return; // Halts the request right here!
```

---

### Q4: How Does `DispatcherServlet` Know Which Controller Matches an Endpoint?

#### Phase 1: Startup Registration (Building the Hash Map)
At application boot, Spring scans all beans tagged with `@RestController`. A core Spring component called `RequestMappingHandlerMapping` inspects class-level `@RequestMapping` and method-level annotations (`@GetMapping`, `@PostMapping`) using Java Reflection and builds an in-memory hash map:

```text
================== SPRING HANDLER MAPPING REGISTRY ==================
Key: [HTTP Method + URL Pattern]      │ Value: [Target Method Reference]
──────────────────────────────────────┼──────────────────────────────
[GET  /api/posts]                     │ PostController.getAllPosts()
[POST /api/posts] (multipart/form)    │ PostController.createPost()
[POST /api/posts/{id}/comments]       │ CommentController.addComment()
[POST /api/auth/login]                │ AuthController.login()
=====================================================================
```

#### Phase 2: Runtime Dispatching
When `POST /api/posts/5/comments` arrives:
1. `DispatcherServlet.doDispatch(request, response)` is triggered.
2. It queries `handlerMapping.getHandler(request)`.
3. In $O(1)$ constant time, it finds `CommentController.addComment()`.
4. It extracts path variables (`{id}` ➔ `5L`), deserializes the JSON body into `CommentRequest`, and injects `Authentication`.
5. It invokes the method via reflection: `method.invoke(controllerBean, 5L, dto, auth)`.
6. Jackson serializes the return object into JSON text and writes it to `HttpServletResponse`.

---

![01Blog Spring IoC Container, Bean Scopes, Lifecycle & Dynamic Proxies](docs/images/01blog_spring_ioc_beans_lifecycle.jpg)

### Q5: What is the Physical Difference Between `BeanFactory` and `ApplicationContext`?

#### The Evaluator's Question:
*"You mentioned the IoC container. Is it a BeanFactory or an ApplicationContext? What is the physical difference in memory?"*

#### The Defense:
1. **The Inheritance Relationship in Java:**
   - In Spring, `ApplicationContext` is a Java **sub-interface** of `BeanFactory`:
     ```text
     BeanFactory (Root IoC Interface)
         ▲
         │ extends
     ApplicationContext (Enterprise Container)
     ```
2. **The Core Physical Difference (Lazy vs Eager Instantiation):**
   - **`BeanFactory` (The Barebones Lazy Engine):**
     - Developed in the early 2000s for resource-constrained devices.
     - Performs **Lazy Loading**: it does NOT instantiate your Beans when the server boots. If you have 50 controllers and services, it creates 0 objects in heap RAM on startup.
     - It only calls `new PostService()` when the first user makes a request to `/api/posts`.
     - **Why this is risky:** If you have a syntax typo, a missing database password, or a broken dependency injection, the server starts up fine, and then **crashes in production on the first customer request!**
   - **`ApplicationContext` (The Modern Spring Boot Engine):**
     - Performs **Eager Pre-Instantiation**: During `./mvnw spring-boot:run`, it immediately creates, wires, and tests all Singleton Beans in JVM heap memory.
     - **The "Fail-Fast" Principle:** If any Bean is missing, invalid, or has circular dependencies, the application refuses to start and crashes within 1.5 seconds right in your terminal. You find bugs at compile/boot time, never in production!
     - Provides enterprise supersets: Event Publishing (`ApplicationEventPublisher`), Internationalization (`MessageSource`), and seamless integration with Spring AOP Proxies.

---

### Q6: Why are Spring Beans Singletons, and How Do 200 Tomcat Threads Share One Service Safely?

#### The Evaluator's Question:
*"By default, Spring Beans are Singletons. Tomcat can process 200 HTTP requests in parallel using 200 worker threads. If 200 threads hit `PostService` at the exact same millisecond, why don't they crash or overwrite each other?"*

#### The Defense:
1. **Why Singletons? (RAM Efficiency):**
   - In a non-Spring naive app, creating `new PostService()` and `new PostRepository()` for every incoming request would create millions of short-lived objects per minute, destroying JVM CPU with constant Garbage Collection pauses.
   - A Spring Singleton means **exactly ONE instance exists in JVM Heap memory** for the entire lifetime of the application.
2. **The Secret of Thread-Safety: Statelessness (Heap vs Stack):**
   - In the JVM, **Heap RAM** is shared across all threads, but every thread gets its own private **Thread Stack** memory!
   - In `PostService.java`:
     ```java
     @Service
     public class PostService {
         private final PostRepository postRepository; // Injected once, read-only!

         public PostResponse createPost(PostRequest request, String username) {
             Post post = new Post(); // <── Allocated on the THREAD'S PRIVATE STACK!
             ...
         }
     }
     ```
   - Our service classes **store ZERO mutable state in class-level fields**. They have no `private String currentUsername;` or `private Post currentPost;`.
   - Every parameter (`request`, `username`) and local variable (`Post post`) lives on the individual worker thread's private stack frame. Thread 1 and Thread 2 never touch each other's variables!
3. **What is `@Scope("prototype")`?**
   - If a class is explicitly annotated with `@Scope("prototype")`, Spring treats it as an object factory: every time a class requests that bean, Spring calls `new MyBean()` to produce a fresh, distinct instance. In 99% of web REST APIs, Singleton is the gold standard.

---

### Q7: Why Did We Use Constructor Injection Instead of `@Autowired` Field Injection?

#### The Evaluator's Question:
*"In `PostController`, `SecurityConfig`, and `JwtAuthFilter`, you wrote explicit constructors. Why didn't you just put `@Autowired` on private fields to save lines of code?"*

#### The Defense:
1. **Field Immutability (`final` keyword):**
   - With Field Injection:
     ```java
     @Autowired
     private PostRepository postRepository; // Cannot be final! Can be reassigned or null.
     ```
   - With Constructor Injection:
     ```java
     private final PostRepository postRepository; // IMMUTABLE!
     public PostService(PostRepository postRepository) {
         this.postRepository = postRepository;
     }
     ```
   - Marking dependencies `final` guarantees that once Spring constructs the bean, its internal references can never be changed or corrupted during runtime.
2. **Prevents `NullPointerException` (Guaranteed Complete State):**
   - With field injection, you can instantiate the object with `new PostService()`, but calling `postService.getAllPosts()` crashes with a `NullPointerException` because its fields are still null until Spring's reflection injects them.
   - With constructor injection, the Java compiler physically forbids creating a `PostService` without passing a valid `PostRepository`.
3. **Pure Unit Testing Without Spring:**
   - In a JUnit test, you don't need to spin up the heavyweight Spring IoC container or use reflection hacks. You simply call `new PostService(mockRepository)`.
4. **Detects Circular Dependencies at Compile/Startup:**
   - If Class A requires Class B, and Class B requires Class A, field injection can hide this architectural flaw until runtime. Constructor injection detects it instantly on startup and throws `BeanCurrentlyInCreationException`.

---

### Q8: What is the 5-Stage Bean Lifecycle, and How Does `DataInitializer.java` Seed the Database on Boot?

#### The Evaluator's Question:
*"Walk me through how a Bean is born and dies in RAM. And explain how `DataInitializer.java` runs automatically when `./mvnw spring-boot:run` executes without any user sending an HTTP request."*

#### The Defense:
1. **The 5 Chronological Stages of a Spring Bean:**
   ```
   [ Stage 1: Instantiation ] ────────▶ Reflection calls constructor: new PostService(...)
                │
   [ Stage 2: Populate Properties ] ──▶ Constructor Dependency Injection wires references
                │
   [ Stage 3: Initialization ] ───────▶ @PostConstruct methods execute
                │
   [ Stage 4: Ready in RAM ] ─────────▶ Bean serves live requests in JVM Heap
                │
   [ Stage 5: Destruction ] ──────────▶ @PreDestroy methods clean up resources on SIGTERM
   ```
2. **How `DataInitializer.java` Works on Boot:**
   - Look at our project's `DataInitializer.java`:
     ```java
     @Component
     public class DataInitializer implements CommandLineRunner {
         @Override
         public void run(String... args) {
             if (userRepository.findByUsername("admin").isEmpty()) {
                 // Create default admin account with BCrypt hash!
             }
         }
     }
     ```
   - `CommandLineRunner` is a special Spring Boot callback interface.
   - Once all beans in the entire `ApplicationContext` are fully instantiated, wired, and verified (Stage 3 complete), Spring Boot scans for any Bean implementing `CommandLineRunner`.
   - It executes their `run()` methods **once on startup, right before opening port 8080 to the public internet**!
   - This ensures the database always has an Admin user and required seed data before the first user request ever arrives.

---

### Q9: What is the Secret Triad Inside `@SpringBootApplication` and How Does Component Scanning Work?

#### The Evaluator's Question:
*"Look at `BlogApplication.java`. It has only one annotation: `@SpringBootApplication`. What does it actually do under the hood? What happens if I create a `@Service` class outside `com.zone01.blog`?"*

#### The Defense:
1. **The Triad of 3 Annotations in One:**
   - `@SpringBootApplication` is a meta-annotation composed of:
     1. **`@SpringBootConfiguration`**: Marks the class as a configuration source (can declare `@Bean` methods).
     2. **`@EnableAutoConfiguration`**: The "Spring Boot magic" flag. It reads your project's `pom.xml`, sees the PostgreSQL driver, Spring Security, and Hibernate JARs on the classpath, and automatically registers pre-configured database connection pools and web servers.
     3. **`@ComponentScan`**: The radar detector! It tells Spring: *"Start from the package containing `BlogApplication.java` (`com.zone01.blog`) and recursively scan every subpackage for `@Component`, `@Service`, `@Repository`, `@RestController`, and `@Configuration`."*
2. **The Evaluator Trap (The Package Boundary):**
   - If someone creates a class in package `com.otherproject.service.MyService`:
   - Spring will **NEVER** find it! It will never become a Bean, and injecting it will fail with `NoSuchBeanDefinitionException`.
   - Why? Because `@ComponentScan` defaults to the base package of the main application class (`com.zone01.blog.*`) and will never scan outside that package tree!

---

### Q10: How Does `@PreAuthorize` Work at the Bytecode Level? (Spring AOP Dynamic Proxies)

#### The Evaluator's Question:
*"In `SecurityConfig.java`, you wrote `@EnableMethodSecurity`. In controllers, you can put `@PreAuthorize("hasRole('ADMIN')")`. Java methods have no native way to pause themselves and check security. How does Spring physically intercept that method call?"*

#### The Defense:
1. **The Aspect-Oriented Programming (AOP) Mechanism:**
   - When Spring detects `@PreAuthorize` on a controller or service, it **does not give the caller the real class instance**.
   - Instead, Spring generates a **Dynamic CGLIB / JDK Proxy** class in JVM memory that wraps the real object!
2. **The Execution Flow in Memory:**
   ```
   [ Incoming Call to adminController.getStats() ]
                          │
                          ▼
             [ CGLIB Dynamic Proxy ] ◄── Invisible wrapper object in RAM!
                          │
                          ├── 1. Intercepts call BEFORE reaching real method
                          ├── 2. Reads SecurityContextHolder.getContext().getAuthentication()
                          ├── 3. Evaluates expression: hasRole('ADMIN')?
                          │
                          ├── IF NO (Regular User or Anonymous):
                          │   Throws AccessDeniedException!
                          │   (Caught by AccessDeniedHandler ➔ returns HTTP 403 Forbidden)
                          │
                          └── IF YES (Admin User):
                              Calls real method: super.getStats()!
                              (Executes controller business logic)
   ```
3. This is pure **Aspect-Oriented Programming (AOP)**: security logic is cleanly separated from business code through bytecode proxies.

---

### Q11: The Evolution of Spring Configuration: What Was XML Configuration and Why Did Spring Boot Kill It?

#### The Evaluator's Question:
*"Why is there zero XML in your project? Where is `applicationContext.xml`? How did developers configure Spring 15 years ago vs today?"*

#### The Defense:
1. **The 3 Historical Eras of Spring:**
   - **Era 1 (The XML Nightmare, 2003–2008):**
     Developers had to maintain massive XML files (`beans.xml`, `applicationContext.xml`) with thousands of lines to define every single class and dependency:
     ```xml
     <bean id="userRepository" class="com.zone01.blog.repository.UserRepository" />
     <bean id="postService" class="com.zone01.blog.service.PostService">
         <constructor-arg ref="userRepository" />
     </bean>
     ```
     - *Why it was painful:* Zero compile-time safety. If a developer renamed `PostService` to `BlogService` in Java, the XML did not update. The project compiled fine, but crashed immediately on boot!
   - **Era 2 (Java Configuration & Annotations, 2009–2013):**
     Spring introduced `@Configuration`, `@Bean`, `@Component`, and `@Autowired`. Configuration became 100% type-safe Java code with full IDE refactoring and auto-completion.
   - **Era 3 (Modern Spring Boot, 2014–Present / Our 01Blog):**
     "Convention over Configuration." By adding `@SpringBootApplication` and curated starter dependencies, Spring Boot automatically configures default beans (PostgreSQL connection pools, Jackson serializers, Tomcat web server) without writing a single line of XML! We only write configuration classes (like `SecurityConfig.java` or `WebMvcConfig.java`) when we need custom business behavior.

---

### Q12: The Complete 6-Stage Bean Lifecycle: What is `BeanPostProcessor` and Where Are AOP Dynamic Proxies Born?

#### The Evaluator's Question:
*"You explained instantiation and initialization. But where physically in the Bean Lifecycle does Spring wrap a bean inside a Dynamic Proxy for `@PreAuthorize` or `@Transactional`? What is a `BeanPostProcessor`?"*

#### The Defense:
1. **The Complete 6-Stage Assembly Line in Heap RAM:**
   ```
   [ 1. Instantiation ] ──────────────▶ Reflection calls constructor: new PostService(...)
                │
   [ 2. Populate Properties ] ────────▶ Spring wires dependencies via Constructor DI
                │
   [ 3. BeanPostProcessor (BEFORE) ] ──▶ postProcessBeforeInitialization() runs
                │
   [ 4. Initialization ] ─────────────▶ @PostConstruct method executes
                │
   [ 5. BeanPostProcessor (AFTER) ] ───▶ postProcessAfterInitialization() runs
                │                         ◄── THIS IS WHERE AOP PROXIES ARE BORN!
                │                         Spring inspects annotations (@PreAuthorize, @Transactional).
                │                         If present, it SWAPS the real bean with a CGLIB DYNAMIC PROXY!
                ▼
   [ 6. Ready for Use in Heap RAM ] ──▶ Active singleton serving requests in ApplicationContext
                │
   [ 7. Destruction on Shutdown ] ────▶ @PreDestroy methods clean up DB connections on SIGTERM
   ```
2. **What is a `BeanPostProcessor`?**
   - It is an internal Spring engine interface (`org.springframework.beans.factory.config.BeanPostProcessor`).
   - It acts as an **assembly-line quality inspector**.
   - Every time Spring constructs and initializes any Bean in the JVM, it passes that Bean through `BeanPostProcessor`.
   - In `postProcessAfterInitialization()`, Spring AOP inspects the class. If it detects method-level security annotations like `@PreAuthorize("hasRole('ADMIN')")`, it wraps the target bean inside a dynamic CGLIB proxy before storing it in the `ApplicationContext` registry!

---

### Q13: How Does Spring Inject Properties from `.env` and `application.properties`? (`@Value` and `Environment`)

#### The Evaluator's Question:
*"In `JwtUtil.java`, you have `@Value("${jwt.secret}")`. How does Spring physically find that secret key in `.env` and inject it into your Java class?"*

#### The Defense:
1. **The `Environment` Abstraction:**
   - On application startup, Spring Boot instantiates an `Environment` object in RAM that aggregates multiple property sources into a unified key-value map:
     1. Operating system environment variables (`.env`)
     2. Configuration files (`application.properties` or `application.yml`)
     3. Command-line arguments (`--server.port=8080`)
2. **The Placeholder Resolver (`PropertySourcesPlaceholderConfigurer`):**
   - During **Stage 2 (Populate Properties)** of the Bean Lifecycle, Spring scans class fields for `@Value("${...}")`.
   - It parses the key inside the `${}` syntax (e.g., `"jwt.secret"`), queries the `Environment` map, retrieves the string value, and uses Java Reflection to set the private field `secretKey` before the class is ever used.

---

### Q14: What Physically is a "Spring Boot Starter" in `pom.xml`?

#### The Evaluator's Question:
*"In your `pom.xml`, you didn't specify versions for Tomcat, Jackson, or Hibernate. You just imported `spring-boot-starter-web`. What is a Starter physically?"*

#### The Defense:
1. **The Traditional Java Dependency Nightmare:**
   - In early Java, developers had to manually hunt down and declare 20+ individual JAR libraries (`tomcat-embed-core-10.1.28.jar`, `jackson-databind-2.17.2.jar`, `hibernate-core-6.5.3.jar`). If one version was incompatible, the application crashed with cryptic `NoSuchMethodError` or `ClassNotFoundException` errors.
2. **What a Starter Physically Is:**
   - A Spring Boot Starter is an **Aggregate Dependency Descriptor (Bill of Materials - BOM)**.
   - It contains zero Java code itself; it is an empty JAR whose `pom.xml` lists all the tested, compatible transitive dependencies for a given feature.
   - By declaring `<parent>spring-boot-starter-parent:3.3.4</parent>`, all library versions are strictly version-locked to guaranteed compatible releases, eliminating dependency hell.

---

### Q15: Comparing the Lifecycle of 3 Real Beans in 01Blog: `CommentService` vs `AdminController` vs `DataInitializer`

![01Blog Comparing the Spring Bean Lifecycle: 3 Real Examples](docs/images/01blog_three_beans_lifecycle_comparison.jpg)

#### The Evaluator's Question:
*"Pick 3 completely different classes in your project and walk me through their exact lifecycle in JVM RAM. Does every bean get wrapped in a proxy? Does every bean run initialization code?"*

#### The Defense:

##### 1. Bean 1: `CommentService` (A Transactional Business Service)
Look at [CommentService.java](backend/src/main/java/com/zone01/blog/service/CommentService.java):
* **Annotations:** `@Service`, with `@Transactional` on the `addComment()` method.
* **Stage 1 (Born):** Reflection invokes `new CommentService(commentRepo, postRepo, userRepo)`.
* **Stage 2 (Wired):** Spring's constructor injection wires the 3 singleton repository beans into its `private final` fields.
* **Stage 3 (Ignition - `@PostConstruct`):** Skipped! `CommentService` has no `@PostConstruct` method, so Spring spends 0 nanoseconds here.
* **Stage 4 (Armored - The Proxy):** **YES!** `BeanPostProcessor` inspects `CommentService` and detects the `@Transactional` annotation on `addComment()`.  
  Spring wraps `CommentService` inside a **CGLIB Transaction Proxy**. When a user posts a comment, the proxy automatically opens a PostgreSQL transaction (`BEGIN`), calls our real Java code, and commits (`COMMIT`) or rolls back (`ROLLBACK`) on error!
* **Stage 5 (Running):** Exists as a stateless singleton in JVM Heap serving comment requests across all 200 Tomcat worker threads.
* **Stage 6 (Dead):** Disposed on JVM shutdown.

---

##### 2. Bean 2: `AdminController` (A Security-Armored Web Controller)
Look at [AdminController.java](backend/src/main/java/com/zone01/blog/controller/AdminController.java):
* **Annotations:** `@RestController`, `@RequestMapping("/api/admin")`, and class-level `@PreAuthorize("hasRole('ADMIN')")`.
* **Stage 1 (Born):** Reflection invokes `new AdminController(adminService, reportService)`.
* **Stage 2 (Wired):** Injects `AdminService` and `ReportService`.
* **Stage 3 (Ignition - `@PostConstruct`):** Skipped.
* **Stage 4 (Armored - The Security Proxy):** **YES!** `BeanPostProcessor` detects `@PreAuthorize("hasRole('ADMIN')")`.  
  Spring creates a **CGLIB Dynamic Security Proxy** around `AdminController`. Every HTTP call routed by `DispatcherServlet` hits the Proxy first. The proxy reads `SecurityContextHolder.getContext().getAuthentication()`. If the user does not have `ROLE_ADMIN`, it throws an `AccessDeniedException` (returning HTTP 403) before the real method is ever executed!
* **Stage 5 (Running):** Sits in RAM mapped to `/api/admin/**`.
* **Stage 6 (Dead):** Disposed on JVM shutdown.

---

##### 3. Bean 3: `DataInitializer` (A Startup Worker Bean)
Look at [DataInitializer.java](backend/src/main/java/com/zone01/blog/config/DataInitializer.java):
* **Annotations:** `@Component`, implements `CommandLineRunner`.
* **Stage 1 (Born):** Reflection invokes `new DataInitializer(userRepository)`.
* **Stage 2 (Wired):** Injects `UserRepository`.
* **Stage 3 (Ignition / Startup Execution):** **YES!** Because `DataInitializer` implements `CommandLineRunner`, Spring Boot executes its `run(String... args)` method **once at startup right after the ApplicationContext is ready**, verifying the database state before port 8080 opens to the public!
* **Stage 4 (Armored - The Proxy):** **NO!** `DataInitializer` has no `@PreAuthorize` or `@Transactional`. It requires zero proxies. Spring keeps it as a plain, direct Java object in memory.
* **Stage 5 (Running):** Its startup work is done; it sits quietly in RAM.
* **Stage 6 (Dead):** Disposed on JVM shutdown.

---

#### Comparison Summary Table

| Lifecycle Stage | `CommentService` | `AdminController` | `DataInitializer` |
|---|---|---|---|
| **Class Type** | `@Service` | `@RestController` | `@Component` |
| **Dependencies** | 3 Repositories | 2 Services | 1 Repository |
| **Ignition (`@PostConstruct`/Runner)** | ❌ Skipped | ❌ Skipped | ✅ Runs `CommandLineRunner.run()` on boot |
| **Dynamic Proxy Wrapping** | ✅ Wrapped in **Transactional Proxy** | ✅ Wrapped in **Security Proxy** (`ROLE_ADMIN`) | ❌ No proxy needed (Plain Java object) |
| **Active Role in RAM** | Executes comment business logic | Handles `/api/admin` HTTP routes | Seeds/inspects DB once on boot |

---

# Session 2: The Security Fortress — Deep Dive into Spring Security, JWT & Cryptography

Spring Security is often regarded as the most intimidating module in the entire Java enterprise ecosystem. Many developers treat it as black magic: they copy-paste a `SecurityFilterChain` bean from StackOverflow and hope for the best.

During a Zone01 peer audit, evaluators will deliberately probe your security defenses:
- *"How does Spring Security physically intercept an HTTP request before Tomcat reaches your controller?"*
- *"What is the `SecurityContext` at the JVM memory level, and why doesn't one user's login overwrite another user's login?"*
- *"Why did you disable CSRF? Explain the physical attack CSRF performs and why your JWT setup is immune."*
- *"Walk me through the mathematics of BCrypt: what is a salt, what is the cost factor, and how does `matches()` work without a separate database column for the salt?"*

In this session, we unpack every single cog, gear, and cryptographic formula in Spring Security from ground zero.

---

## Part 0: The Missing Foundations & Why Spring Security Exists

---

### 1. Authentication vs Authorization (The ID vs The Keycard)

These two concepts form the bedrock of all access control:

* **Authentication (AuthN) — *"Who are you?"***
  - The process of verifying a claimed identity.
  - *Physical example:* You show your government passport at an airport border control booth.
  - *In 01Blog:* When a student sends their username (`"rachid"`) and password (`"secret123"`), the system checks PostgreSQL and verifies: *"Yes, that password mathematically matches the stored hash for user 'rachid'."*
* **Authorization (AuthZ) — *"What are you allowed to do?"***
  - The process of checking whether an already-authenticated identity has permission to perform a specific action or access a specific resource.
  - *Physical example:* Now that you are inside the airport, can you walk into the cockpit of the airliner? No. You have the role `PASSENGER`, not `PILOT`.
  - *In 01Blog:* A student with `ROLE_USER` is authorized to create a post, like, or comment. However, if they try to call `DELETE /api/admin/users/4`, Spring Security's authorization engine intercepts them and returns `HTTP 403 FORBIDDEN` because they lack `ROLE_ADMIN`.

---

### 2. How Tomcat Talks to Spring Security: `DelegatingFilterProxy` & `FilterChainProxy`

Here is a fundamental architectural puzzle:  
**Tomcat is a Servlet container managed by the OS and Java Servlet specifications. Spring's IoC container is a separate Java world managed by Spring.**  
How does a standard Servlet container hand HTTP traffic over to Spring Beans managed inside Spring's IoC container?

```
[ Incoming Request from OS ]
             │
             ▼
[ Apache Tomcat Servlet Engine ]
             │
             ▼ 1. Calls standard Servlet Filter
[ DelegatingFilterProxy (Standard Servlet Filter in Tomcat) ]
             │
             ▼ 2. Looks up Spring Bean named "springSecurityFilterChain"
[ Spring IoC Container (ApplicationContext) ]
             │
             ▼ 3. Hands request to Spring's internal security manager
[ FilterChainProxy (Master Spring Security Bean) ]
             │
             ▼ 4. Passes request down our custom SecurityFilterChain
[ SecurityFilterChain: CorsFilter ➔ CsrfFilter ➔ JwtAuthFilter ➔ AuthorizationFilter ]
```

#### Step-by-Step Mechanism:
1. **The Bridge (`DelegatingFilterProxy`):**  
   Tomcat only knows about standard Java Servlet filters declared in servlet specifications. Spring provides a standard servlet filter called `DelegatingFilterProxy`. Its sole job is to act as a **physical bridge**. It does not do security checks itself; it simply asks the Spring IoC container:  
   *"Hey Spring, do you have a Bean named `springSecurityFilterChain`? Here are the `request` and `response` objects, you take over."*
2. **The Manager (`FilterChainProxy`):**  
   Inside Spring, the Bean named `springSecurityFilterChain` is an instance of `FilterChainProxy`. It holds a list of all configured `SecurityFilterChain` instances and routes the request down the pipeline of individual security filters.

---

### 3. Why Stateful Sessions Died & The Stateless Revolution

In legacy Java architectures (Spring MVC with JSP or classic PHP/Rails apps), authentication relied on **Stateful Server Sessions**:

```
[ Browser ] ───(POST /login)───► [ Tomcat Web Server ]
                                       │
                                       ▼ Allocates in RAM:
                                       HttpSession Object (ID: "JSESSIONID-9871")
                                       Data: { user: "rachid", role: "ADMIN" }
[ Browser ] ◄──(Set-Cookie: JSESSIONID=9871)───
```

#### Why Stateful Sessions Failed Modern Web Requirements:
1. **Server RAM Exhaustion (Memory Bloat):**  
   If 100,000 active students are logged in, Tomcat must maintain 100,000 `HttpSession` objects in heap memory. If users don't log out, expired sessions consume gigabytes of RAM until garbage collected.
2. **Horizontal Scaling Disaster (Session Stickiness):**  
   When your application grows and you place two backend servers (`Backend-1` and `Backend-2`) behind a Load Balancer (like Nginx):
   - Request 1 (Login) hits `Backend-1`. Session is saved in `Backend-1`'s RAM.
   - Request 2 (Create Post) is routed to `Backend-2`. `Backend-2` has never seen this user! Its RAM is empty. It responds: `401 Unauthorized`.
   - Fixing this required complex, expensive tools like Redis session clustering or sticky sessions.
3. **Cross-Domain & Mobile Limitations:**  
   Native iOS/Android apps and standalone Single-Page Applications (like Angular running on `localhost:4200` talking to `localhost:8080`) struggle with browser third-party cookie restrictions.

#### The Stateless Solution:
In our `SecurityConfig.java`:
```java
.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
```
This single line instructs Tomcat:  
> *"Never allocate an `HttpSession` in RAM. Never create a `JSESSIONID` cookie. Treat every single incoming HTTP request as if the client is contacting us for the first time."*

Instead of the server holding state, the client presents a self-contained, digitally signed cryptographic passport: the **JSON Web Token (JWT)**.

---

### 4. Encryption vs Hashing (The One-Way Mathematical Trapdoor)

Never tell an auditor that passwords are "encrypted". Hashing and encryption are fundamentally different mathematical operations:

```
ENCRYPTION (Two-Way):
Plain Text: "password123" ──[ Encrypt with Key ]──► Ciphertext: "a8#x9!z"
Ciphertext: "a8#x9!z" ─────[ Decrypt with Key ]──► Plain Text: "password123"

HASHING (One-Way Mathematical Trapdoor):
Plain Text: "password123" ──[ Cryptographic Hash ]──► "$2a$10$N9qo8uLOic..."
"$2a$10$N9qo8uLOic..." ───[ Reverse / Decrypt? ]──► IMPOSSIBLE!
```

* **Encryption is reversible:** If an attacker breaches the server and finds the encryption key, they can decrypt all user passwords into plain text immediately.
* **Hashing is irreversible:** A cryptographic hash is a one-way mathematical function that destroys information while producing a fixed-length digest. There is no mathematical formula to reverse it.
* **Authentication with Hashing:** When logging in, the server hashes the user's input password using the exact same salt and parameters and compares the two resulting digests. If the outputs match, the user entered the correct password.

---

## Part 1: The Core Architecture of Spring Security in Memory

When Spring Security is running, how does it physically represent an authenticated user in JVM memory?

---

### 1. The Three Russian Dolls: `SecurityContextHolder`, `SecurityContext`, and `Authentication`

Spring Security organizes security data in three nested layers:

```
┌─────────────────────────────────────────────────────────────┐
│                   SecurityContextHolder                     │
│  (Static utility class providing global access to security)  │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │                  SecurityContext                    │   │
│   │  (Interface wrapping the currently authenticated)   │   │
│   │                                                     │   │
│   │   ┌─────────────────────────────────────────────┐   │   │
│   │   │               Authentication                │   │   │
│   │   │  (The core token representing the user)     │   │   │
│   │   │                                             │   │   │
│   │   │  - Principal:   "rachid" (User identity)    │   │   │
│   │   │  - Credentials: null (Cleared after login)  │   │   │
│   │   │  - Authorities: [ROLE_ADMIN] (Permissions)  │   │   │
│   │   │  - Details:     Remote IP, Session details  │   │   │
│   │   │  - Authenticated: true                      │   │   │
│   │   └─────────────────────────────────────────────┘   │   │
│   └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

#### In Project Code (`JwtAuthFilter.java`):
Look at lines 66–69:
```java
var authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
var authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

// We place the Authentication doll inside the SecurityContext doll:
SecurityContextHolder.getContext().setAuthentication(authToken);
```

#### What each doll represents:
1. **`Authentication`**: Represents the token of the logged-in user.
   - `getPrincipal()`: Returns the identity (in our project, the `String` username `"rachid"`).
   - `getCredentials()`: The password. In a stateless JWT architecture, credentials are set to `null` once authenticated so passwords never linger in RAM.
   - `getAuthorities()`: The collection of granted permissions (`ROLE_USER`, `ROLE_ADMIN`).
   - `isAuthenticated()`: Returns `true` if the credentials were successfully verified.
2. **`SecurityContext`**: A lightweight interface that holds the `Authentication` object:
   ```java
   public interface SecurityContext extends Serializable {
       Authentication getAuthentication();
       void setAuthentication(Authentication authentication);
   }
   ```
3. **`SecurityContextHolder`**: The master static class you can call from anywhere in your codebase (`SecurityContextHolder.getContext()`) to retrieve the current user.

---

### 2. The JVM Engine Room: How `ThreadLocal` Physically Works in RAM

This is a favorite evaluation question:  
**"If `SecurityContextHolder` is a static class, why doesn't User A's request overwrite User B's security context when 100 students use the app simultaneously?"**

#### The Secret: `ThreadLocal`
By default, `SecurityContextHolder` stores the `SecurityContext` inside a **`ThreadLocal`** object:

```
JVM HEAP MEMORY:
┌────────────────────────────────────────────────────────────────┐
│ Tomcat Worker Thread-1 (Processing Alice's request)            │
│ └── Thread.currentThread().threadLocals                        │
│     └── ThreadLocalMap:                                        │
│         Key: SecurityContextHolder.strategy                    │
│         Value: SecurityContext { Principal: "alice" }          │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│ Tomcat Worker Thread-2 (Processing Bob's request)              │
│ └── Thread.currentThread().threadLocals                        │
│     └── ThreadLocalMap:                                        │
│         Key: SecurityContextHolder.strategy                    │
│         Value: SecurityContext { Principal: "bob" }            │
└────────────────────────────────────────────────────────────────┘
```

#### How it works at the OS and JVM level:
1. When Alice sends an HTTP request, Tomcat picks an idle worker thread (e.g., `http-nio-8080-exec-1`).
2. When Bob sends an HTTP request at the exact same millisecond, Tomcat picks another worker thread (`http-nio-8080-exec-2`).
3. Each Java `Thread` object has an internal field: `ThreadLocal.ThreadLocalMap threadLocals`.
4. When `JwtAuthFilter` calls `SecurityContextHolder.getContext().setAuthentication(token)`, it writes into the **current executing thread's private memory bucket**.
5. Thread-1 can never see Thread-2's data. They are physically isolated in JVM memory.

#### The Danger of Thread Pooling (Why Spring Cleans Up):
Tomcat **reuses** worker threads! When Alice's request finishes, Thread-1 does not die; it returns to the pool to handle a future request from Charlie.  
If the `SecurityContext` were not cleared, Charlie might inherit Alice's logged-in identity!  
Spring Security automatically executes a cleanup step at the end of the filter chain (`SecurityContextHolder.clearContext()`), resetting the `ThreadLocal` to `null`.

---

### 3. The Roles & Authorities Engine (`ROLE_` Prefix & `GrantedAuthority`)

In Spring Security, permissions are represented by the `GrantedAuthority` interface:

```java
public interface GrantedAuthority extends Serializable {
    String getAuthority();
}
```

Our project uses the standard implementation: `SimpleGrantedAuthority`.

#### The `ROLE_` Prefix Convention:
Notice in our database enum `UserRole.java`:
```java
public enum UserRole {
    ROLE_USER,
    ROLE_ADMIN
}
```

* Why does it start with `ROLE_`?  
  Spring Security has a built-in historical convention:
  - When you use `.hasRole("ADMIN")` in `SecurityConfig.java`, Spring automatically prepends `ROLE_` and looks for an authority named `ROLE_ADMIN`.
  - When you use `.hasAuthority("ROLE_ADMIN")`, Spring looks for the exact string `"ROLE_ADMIN"` without prepending anything.
* In our project, both `hasRole("ADMIN")` and `@PreAuthorize("hasRole('ADMIN')")` seamlessly match our enum value `ROLE_ADMIN`.

---

## Part 2: The Security Filter Chain (The Bouncer Gauntlet)

![01Blog Spring Security Complete Pipeline & doFilter Demystified](docs/images/01blog_filter_chain_architecture.jpg)

When an HTTP request arrives at Tomcat, it does not go straight to `PostController`. It must pass through the **Security Filter Chain**.

---

### 1. The Exact Filter Chain Sequence & Order of Execution

In [`SecurityConfig.java`](backend/src/main/java/com/zone01/blog/config/SecurityConfig.java), we registered our two custom filters:
```java
// Rate limit incoming requests before authentication processing
.addFilterBefore(rateLimitFilter, org.springframework.security.web.authentication.logout.LogoutFilter.class)
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

Here is the exact chronological sequence of filters an incoming HTTP request traverses in 01Blog:

```
[ Incoming HTTP Request from Port 8080 ]
                  │
                  ▼
  1. CorsFilter
     - Reads "Origin: http://localhost:4200" header
     - If HTTP method is OPTIONS (Preflight), responds immediately with CORS approval headers!
                  │
                  ▼
  2. RateLimitFilter (OUR CUSTOM FIRST-LINE DEFENSE FILTER)
     - Resolves client IP (inspects "X-Forwarded-For" or falls back to remote socket address)
     - Enforces in-memory quotas: 20 req/min for /api/auth/**, 120 req/min for general API
     - If quota exceeded: immediately halts request with HTTP 429 TOO_MANY_REQUESTS & Retry-After: 60
     - Drops abusive traffic BEFORE any CPU-heavy BCrypt hashing, JWT parsing, or database queries!
                  │
                  ▼
  3. CsrfFilter (Disabled in our config)
     - Passed through instantly because our API is stateless
                  │
                  ▼
  4. SecurityContextHolderFilter
     - Prepares clean ThreadLocal storage for the current thread
                  │
                  ▼
  5. JwtAuthFilter (OUR CUSTOM AUTHENTICATION FILTER)
     - Reads "Authorization: Bearer <token>"
     - Validates cryptographic signature via JwtUtil
     - Checks if user is banned (isBanned == true)
       - If banned: halts request with 403 ACCOUNT_BANNED
       - If valid: sets SecurityContextHolder with user and authorities
                  │
                  ▼
  6. UsernamePasswordAuthenticationFilter (Default Spring Form-Login Filter)
     - Since our JwtAuthFilter already authenticated the user, this filter sees an existing Authentication and simply passes it along
                  │
                  ▼
  7. AuthorizationFilter (The Route Rule Enforcer)
     - Evaluates .requestMatchers() rules:
       - Is it /api/admin/**? User MUST have ROLE_ADMIN!
       - Is it /api/posts/**? User MUST be authenticated!
       - If rule violated: throws AccessDeniedException
                  │
                  ▼
[ Request Arrives at DispatcherServlet ➔ PostController ]
```

---

### 2. The Gatekeepers: `AuthenticationEntryPoint` (401) vs `AccessDeniedHandler` (403)

If an unauthorized request arrives, what happens?  
By default, Spring Boot renders an ugly HTML "Whitelabel Error Page". For a modern Angular SPA, this is unacceptable: Angular expects clean JSON.

In [`SecurityConfig.java`](backend/src/main/java/com/zone01/blog/config/SecurityConfig.java), we customized both exception handlers:

```java
.exceptionHandling(exceptions -> exceptions
    // 401 UNAUTHORIZED: When an unauthenticated user tries to access a protected route
    .authenticationEntryPoint((request, response, authException) -> {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.UNAUTHORIZED.value()); // 401
        response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now() + "\",\"status\":401,\"error\":\"UNAUTHORIZED\",\"message\":\"Authentication required to access this resource.\"}");
    })
    // 403 FORBIDDEN: When a logged-in user lacks the required role (e.g. ROLE_USER hitting an admin route)
    .accessDeniedHandler((request, response, accessDeniedException) -> {
        response.setContentType("application/json");
        response.setStatus(HttpStatus.FORBIDDEN.value()); // 403
        response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now() + "\",\"status\":403,\"error\":\"FORBIDDEN\",\"message\":\"You do not have permission to access this resource.\"}");
    })
)
```

| HTTP Code | Error Name | Meaning | Trigger Condition |
|---|---|---|---|
| **401** | `UNAUTHORIZED` | *"I don't know who you are."* | Token is missing, expired, or cryptographically invalid. |
| **403** | `FORBIDDEN` | *"I know who you are, but you cannot enter."* | User is authenticated as `ROLE_USER` but tried to access an endpoint requiring `ROLE_ADMIN`, or account is banned. |

---

### 3. The Shield at the Gate: In-Memory Rate Limiting & DoS Defense (`RateLimitFilter`)

#### Why Did We Build a Rate Limiter? (The Ground-Zero Problem)
1. **The BCrypt CPU Exhaustion Attack (Brute-Force & Denial of Service):**
   - In Session 2, we learned that BCrypt is intentionally slow by design ($2^{10} = 1024$ key expansion rounds taking ~50-100ms of intensive CPU computation per password check).
   - If an automated bot script floods `/api/auth/login` with 5,000 attempts per second, Tomcat's worker threads (200 maximum by default) become 100% pegged calculating BCrypt hashes. All CPU cores spike to 100%, and legitimate students cannot load the blog because the server has no free threads to handle genuine requests.
2. **Database Scurrying & Resource Flooding:**
   - Similarly, if an automated script spams `/api/posts` with thousands of rapid requests, it drains PostgreSQL's connection pool.

#### How `RateLimitFilter` Works in Memory:
* **The Sliding 1-Minute Window Counter Pattern:**
  - We define two strict thresholds per client IP:
    - `AUTH_LIMIT = 20`: A maximum of 20 login or registration attempts per 60-second window.
    - `GENERAL_LIMIT = 120`: A maximum of 120 general API requests per 60-second window (2 requests per second sustained).
    - `WINDOW_MS = 60_000L` (1 minute).
* **The `RequestTracker` in JVM RAM:**
  ```java
  private static class RequestTracker {
      long windowStart = System.currentTimeMillis();
      int count = 0;
  }
  ```
  Every IP has a tracker stored inside a thread-safe `ConcurrentHashMap<String, RequestTracker>`.
* **Chronological Flow of a Request Through `RateLimitFilter`:**
  1. **Bypass Checks:** If the request is an `OPTIONS` preflight request, an uploaded static media file (`/uploads/**`), or an internal error dispatcher (`/error`), it passes through immediately without burning quota.
  2. **IP Resolution (`getClientIp`):** It checks the `X-Forwarded-For` HTTP header first (in case the request passed through an Nginx reverse proxy or cloud load balancer), extracting the true client IP. If absent, it reads the direct TCP socket address (`request.getRemoteAddr()`).
  3. **Quota Inspection (`isAllowed`):**
     - If the elapsed time since `windowStart` exceeds 60 seconds, the window resets (`windowStart = now`, `count = 0`).
     - If `count < maxAllowed`, `count` increments by 1 and the request proceeds along the filter chain.
     - If `count >= maxAllowed`, the request is **immediately aborted**!
  4. **The HTTP 429 Rejection:**
     - The filter sets HTTP Status **`429 Too Many Requests`**.
     - It writes the standard HTTP response header: `Retry-After: 60` (telling client browsers to wait 60 seconds).
     - It writes a clean JSON error payload:
       `{"timestamp":"...","status":429,"error":"TOO_MANY_REQUESTS","message":"Too many requests. Please slow down and try again in a minute."}`
     - It returns immediately without calling `filterChain.doFilter()`, completely protecting Tomcat, the CPU, and PostgreSQL!
* **Memory Leak Guard:**
  - What happens if 100,000 unique bots connect over time? The `clientTrackers` map would grow indefinitely and cause a `java.lang.OutOfMemoryError` in JVM heap RAM.
  - To prevent this, whenever the map contains more than 500 entries, it automatically triggers a memory purge removing all expired windows:
    ```java
    if (clientTrackers.size() > 500) {
        clientTrackers.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_MS);
    }
    ```

## Part 3: Web Defense Foundations: CORS & CSRF Unmasked

---

### 1. CORS: Same-Origin Policy & Preflight OPTIONS Requests

#### What is the Same-Origin Policy (SOP)?
Web browsers enforce a strict security policy: JavaScript running on one **Origin** (defined as `Protocol + Domain + Port`) is forbidden from reading HTTP responses from a different Origin.

In our development environment:
- Angular runs on: `http://localhost:4200`
- Spring Boot runs on: `http://localhost:8080`
- Because the ports differ (`4200` vs `8080`), they are **two different origins**! Without CORS, the browser blocks Angular from reading any backend data.

#### The Preflight `OPTIONS` Request:
Before Angular sends a "non-simple" request (such as a `POST` with `Content-Type: application/json` or custom `Authorization` headers), the browser automatically sends an invisible handshake request first:

```http
OPTIONS /api/posts HTTP/1.1
Host: localhost:8080
Origin: http://localhost:4200
Access-Control-Request-Method: POST
Access-Control-Request-Headers: authorization, content-type
```

The browser is asking Tomcat:  
> *"Hey backend, before I let Angular send this data, do you allow `http://localhost:4200` to send POST requests with an Authorization header?"*

#### How our `SecurityConfig.java` resolves this:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(List.of("http://localhost:4200")); // Whitelist Angular
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(List.of("*"));
    configuration.setAllowCredentials(true);

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```
Tomcat's `CorsFilter` catches the `OPTIONS` request and responds with:
```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: http://localhost:4200
Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS
Access-Control-Allow-Headers: *
```
The browser sees this approval and immediately dispatches the real `POST` request.

---

### 2. CSRF: The Cookie Exploitation Attack & Why Stateless JWTs Are Immune

Evaluators love to test students on why `csrf().disable()` is used in `SecurityConfig.java`.

#### How a Real CSRF Attack Works (The Bank Transfer Example):
1. You log into `mybank.com`. The bank uses traditional **cookie sessions** (`Set-Cookie: JSESSIONID=123`).
2. Without logging out, you open a new tab and visit `malicious-site.com`.
3. `malicious-site.com` has hidden HTML code:
   ```html
   <img src="http://mybank.com/transfer?to=hacker&amount=1000" />
   ```
4. When your browser tries to load that image, the browser automatically attaches your `mybank.com` session cookie!
5. The bank server sees a valid cookie and transfers the money. That is **Cross-Site Request Forgery**.

#### Why CSRF is Physically Impossible with Stateless JWTs:
1. Our backend uses **no session cookies**.
2. Our JWT token is stored inside Angular's JavaScript state (or browser storage).
3. Whenever Angular communicates with the backend, Angular's `jwt.interceptor.ts` manually sets:
   ```typescript
   headers: { Authorization: `Bearer ${token}` }
   ```
4. **Web browsers NEVER automatically attach custom HTTP headers across origins.** A malicious website cannot force your browser to invent an `Authorization: Bearer` header.
5. Therefore, CSRF attacks are physically impossible against our architecture, and leaving CSRF protection enabled would only cause broken requests and unnecessary token overhead.

---

## Part 4: Cryptography Deep Dive: BCrypt & JWT Under the Microscope

![01Blog ThreadLocal Memory, BCrypt Hashing & JWT Anatomy](docs/images/01blog_cryptography_and_memory.jpg)

---

### 1. Inside BCrypt: Salting, Blowfish Cipher & The Cost Factor

In [`AuthService.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/service/AuthService.java#L78), passwords are encrypted using:
```java
String hashedPassword = passwordEncoder.encode(request.getPassword());
```
Under the hood, this executes **BCrypt**, designed by Niels Provos and David Mazières based on the Blowfish symmetric cipher.

#### The 4-Part Anatomy of a BCrypt Hash:
Every BCrypt hash string stored in our PostgreSQL `users` table is exactly **60 characters long**:

```text
$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
─── ── ────────────────────── ──────────────────────────────
 │   │            │                          │
 │   │            │                          └─ 31 Chars: Hash Ciphertext
 │   │            └─ 22 Chars: 128-bit Random Salt (Base64-encoded)
 │   └─ Cost Factor (10 = 2^10 = 1024 hashing rounds)
 └─ Schema Identifier (2a = Modern BCrypt specification)
```

#### Why BCrypt is Brute-Force Proof:
1. **The Salt (22 characters):**  
   Every time you call `encode()`, BCrypt generates a fresh 16-byte random salt using `SecureRandom`. Even if two users choose the identical password `"password123"`, their hashes in PostgreSQL will be completely different. This completely neutralizes precomputed **Rainbow Table** attacks.
2. **The Cost Factor (Work Factor):**  
   In our configuration, the cost factor is `10`. This means the internal key schedule runs $2^{10} = 1,024$ rounds. Fast hashing algorithms (like MD5 or SHA-256) can compute billions of hashes per second on a modern GPU. BCrypt is intentionally designed to be **CPU-intensive and memory-hard**, making GPU brute-forcing economically and computationally infeasible.
3. **Self-Contained Verification (`matches`):**  
   When a user logs in, `passwordEncoder.matches(typedPassword, storedHash)` does not need a separate salt column. It reads the salt from characters 8–29 of `storedHash`, hashes `typedPassword` with that exact salt and cost factor, and checks if the output matches the remaining 31 characters.

---

### 2. Inside JWT: Base64Url Bitwise Encoding, Claims & HMAC-SHA256 Seals

In [`JwtUtil.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/config/JwtUtil.java#L29-L39), we generate JWT tokens using the `jjwt` library.

A JWT consists of 3 Base64Url-encoded segments joined by periods:
```text
Header.Payload.Signature
```

```
eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJyYWNoaWQiLCJpYXQiOjE3...mYz.dBjftJeZ4CVP-mB92K...
──────────────────── ────────────────────────────────────── ────────────────────────
     (Header)                      (Payload)                       (Signature)
```

#### 1. The Header:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```
Specifies the cryptographic signing algorithm: **HMAC using SHA-256**.

#### 2. The Payload (Claims):
```json
{
  "sub": "rachid",
  "iat": 1729278000,
  "exp": 1729364400
}
```
* `sub`: Subject (the username).
* `iat`: Issued At (creation timestamp).
* `exp`: Expiration (set to `now + 86400000ms` = 24 hours).

> **What is Base64Url Encoding?**  
> Standard Base64 uses `+`, `/`, and `=` padding characters. In URLs and HTTP headers, `/` and `+` have special meanings and can break HTTP transmission. Base64Url replaces `+` with `-`, replaces `/` with `_`, and strips the trailing `=` padding so the token can safely travel inside HTTP headers.

#### 3. The Signature (The Cryptographic Lock):
How is the signature calculated?
```text
Signature = HMAC-SHA256(
    Base64Url(Header) + "." + Base64Url(Payload),
    SecretKey (From .env)
)
```
* The server reads `app.jwt.secret` from `.env`.
* It feeds the secret key and the combined `Header.Payload` string into the HMAC-SHA256 algorithm.
* **Why it cannot be forged:** If an attacker decodes the payload, changes `"sub": "rachid"` to `"sub": "admin"`, and re-encodes it, they cannot generate the matching signature without the server's private 256-bit secret key. When `JwtUtil.validateToken()` runs, the calculated hash will not match, throwing a `SignatureException` and immediately rejecting the forgery!

---

## Part 5: Syntax Breakdown of Project Code

---

### Anatomy of [`SecurityConfig.java`](backend/src/main/java/com/zone01/blog/config/SecurityConfig.java)

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    private final RateLimitFilter rateLimitFilter;
    private final JwtAuthFilter jwtAuthFilter;

    public SecurityConfig(RateLimitFilter rateLimitFilter, JwtAuthFilter jwtAuthFilter) {
        this.rateLimitFilter = rateLimitFilter;
        this.jwtAuthFilter = jwtAuthFilter;
    }
```
* **`@Configuration`**: Informs Spring that this class contains Bean definitions (`@Bean`) to be registered in the IoC container.
* **`@EnableWebSecurity`**: Activates Spring Security's web security support and integrates the filter chain into Tomcat.
* **`@EnableMethodSecurity`**: Enables method-level security annotations like `@PreAuthorize("hasRole('ADMIN')")` across our controllers and services.
* **Constructor Injection**: Injects both `RateLimitFilter` and `JwtAuthFilter` as singleton Spring Beans.

```java
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
```
* Declares `BCryptPasswordEncoder` as a singleton Spring Bean, allowing `AuthService` to inject it for password hashing and verification.

```java
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**", "/uploads/**", "/error", "/api/users/avatars/presets").permitAll()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/me/**", "/api/users/requests/**").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/posts/**", "/api/users/*", "/api/users/search").permitAll()
                .requestMatchers("/api/posts/**", "/api/users/**", "/api/reports/**", "/api/notifications/**").authenticated()
                .anyRequest().permitAll()
            )
            .exceptionHandling(...)
            // Rate limit incoming requests before authentication processing
            .addFilterBefore(rateLimitFilter, org.springframework.security.web.authentication.logout.LogoutFilter.class)
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
```
* **`.requestMatchers(...)`**: Matches URL patterns and applies role requirements:
  - Public endpoints (`permitAll()`): Registration, login, public image uploads, avatar presets.
  - Admin endpoints (`hasRole("ADMIN")`): `/api/admin/**`.
  - Authenticated user endpoints (`authenticated()`): Post creation, commenting, liking, reporting, notifications.
* **`.addFilterBefore(rateLimitFilter, LogoutFilter.class)`**: Mounts our rate limiter early in the chain, prior to logout and all authentication mechanisms.
* **`.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`**: Mounts our custom JWT verification filter ahead of the default form-login filter.

---

### Anatomy of [`RateLimitFilter.java`](backend/src/main/java/com/zone01/blog/config/RateLimitFilter.java)

```java
@Component
public class RateLimitFilter extends OncePerRequestFilter {

    private static final int AUTH_LIMIT = 20;     // 20 attempts per minute
    private static final int GENERAL_LIMIT = 120; // 120 requests per minute
    private static final long WINDOW_MS = 60_000L; // 60-second window

    private static class RequestTracker {
        long windowStart = System.currentTimeMillis();
        int count = 0;
    }

    private final Map<String, RequestTracker> clientTrackers = new ConcurrentHashMap<>();
```
* **`@Component` & `extends OncePerRequestFilter`**: Registers the filter as a Spring Bean and guarantees it fires exactly once per incoming HTTP dispatch.
* **Threshold Constants**: Distinguishes between sensitive brute-force targets (`/api/auth/**` limited to 20/min) and normal browsing (`/api/**` limited to 120/min).
* **`RequestTracker`**: A lightweight timestamped counter object instantiated in heap memory for each active client IP.
* **`ConcurrentHashMap`**: A thread-safe hash map that allows high-throughput concurrent reads and writes across Tomcat's multi-threaded worker pool without global locking.

```java
    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // Skip CORS preflight checks, static files, and internal error dispatcher
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        String uri = request.getRequestURI();
        if (uri.startsWith("/uploads/") || uri.equals("/error")) {
            filterChain.doFilter(request, response);
            return;
        }

        String clientIp = getClientIp(request);
        boolean isAuthEndpoint = uri.startsWith("/api/auth/");
        int maxAllowed = isAuthEndpoint ? AUTH_LIMIT : GENERAL_LIMIT;
        String trackingKey = (isAuthEndpoint ? "AUTH:" : "GEN:") + clientIp;

        if (!isAllowed(trackingKey, maxAllowed)) {
            response.setStatus(429); // 429 Too Many Requests
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.setHeader("Retry-After", "60");
            response.getWriter().write("{\"timestamp\":\"" + LocalDateTime.now() + "\",\"status\":429,\"error\":\"TOO_MANY_REQUESTS\",\"message\":\"Too many requests. Please slow down and try again in a minute.\"}");
            return; // HALT the request pipeline immediately
        }

        filterChain.doFilter(request, response); // Pass baton to next filter
    }
```
* **Preflight & Static Bypass**: Browsers automatically send HTTP `OPTIONS` before cross-origin POST requests. Blocking `OPTIONS` would break legitimate Angular requests. Static image downloads (`/uploads/`) do not execute application logic and are also exempted.
* **`trackingKey` Prefixing**: Prevents an auth flood from starving general browsing quota and vice versa (`AUTH:192.168.1.5` vs `GEN:192.168.1.5`).
* **HTTP 429 + `Retry-After: 60`**: Returns the RFC 6585 standard code along with instructions for the client to cool down for 60 seconds.

```java
    private synchronized boolean isAllowed(String key, int maxAllowed) {
        long now = System.currentTimeMillis();

        // Memory cleanup: purge stale records if tracker map grows large
        if (clientTrackers.size() > 500) {
            clientTrackers.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_MS);
        }

        RequestTracker tracker = clientTrackers.computeIfAbsent(key, k -> new RequestTracker());

        // Reset counter once the 60-second window expires
        if (now - tracker.windowStart > WINDOW_MS) {
            tracker.windowStart = now;
            tracker.count = 0;
        }

        if (tracker.count >= maxAllowed) {
            return false;
        }

        tracker.count++;
        return true;
    }
```
* **`synchronized`**: Prevents race conditions when multiple threads for the exact same IP check and increment quota at the exact same millisecond.
* **Memory Leak Safeguard (`size > 500`)**: If thousands of unique IPs make requests over time, memory does not grow unbounded. Entries whose 60-second window has elapsed are pruned on the fly.
* **`computeIfAbsent(key, ...)`**: Atomically instantiates a `RequestTracker` for new clients if one does not already exist.

```java
    private String getClientIp(HttpServletRequest request) {
        String xForwarded = request.getHeader("X-Forwarded-For");
        if (xForwarded != null && !xForwarded.isBlank()) {
            return xForwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
```
* **`X-Forwarded-For` Extraction**: When behind an Nginx reverse proxy or cloud load balancer, `request.getRemoteAddr()` would always return `127.0.0.1` (the proxy's local IP), which would accidentally group all users worldwide into a single IP! Reading the first comma-separated entry of `X-Forwarded-For` recovers the actual client's true internet IP.
* **`.addFilterBefore(jwtAuthFilter, ...)`**: Mounts our custom filter ahead of the default authentication filter.

---

### Anatomy of [`JwtAuthFilter.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/config/JwtAuthFilter.java) & The Banned User Lockdown

```java
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, UserRepository userRepository) {
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            if (jwtUtil.validateToken(token)) {
                String username = jwtUtil.extractUsername(token);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    User user = userRepository.findByUsername(username).orElse(null);

                    // 🚨 INSTANT BANNED USER LOCKDOWN 🚨
                    if (user != null && user.isBanned()) {
                        response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                        response.setContentType("application/json");
                        response.setCharacterEncoding("UTF-8");
                        response.getWriter().write("{\"error\":\"ACCOUNT_BANNED\",\"message\":\"This account has been suspended or banned by an administrator.\"}");
                        return; // Halts the request right here! Never reaches controllers!
                    }

                    if (user != null) {
                        var authorities = List.of(new SimpleGrantedAuthority(user.getRole().name()));
                        var authToken = new UsernamePasswordAuthenticationToken(username, null, authorities);
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
```

#### Why this banned user check is architectural genius:
In standard JWT systems, a major drawback is: *"Once a JWT is issued, it cannot be revoked until it expires (24h)."*  
If an administrator bans a toxic user, can that user keep posting for 24 hours?  
**In 01Blog, NO.**  
Our `JwtAuthFilter` checks `user.isBanned()` directly on every single incoming authenticated request. The moment an admin clicks "Ban User", the database flips `is_banned = true`. The very next HTTP request from that user is intercepted at the filter, rejected with `403 ACCOUNT_BANNED`, and Angular immediately kicks them to the login screen!

---

### Anatomy of [`JwtUtil.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/config/JwtUtil.java)

```java
@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration-ms}")
    private long expirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationMs);

        return Jwts.builder()
                .setSubject(username)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
```
* **`Keys.hmacShaKeyFor(secret.getBytes(...))`**: Generates a cryptographically secure `SecretKey` specification from our raw `.env` secret string.
* **`Jwts.builder()...compact()`**: Builds the header, payload, and cryptographic signature, returning the compact dot-separated Base64Url string.
* **`validateToken(...)`**: Tries to parse the claims using `Jwts.parserBuilder().setSigningKey(...).build().parseClaimsJws(token)`. If the token was tampered with or expired, `JwtException` is caught and returns `false`.

---

### Anatomy of [`AuthService.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/service/AuthService.java) (Bootstrap Admin & Password Verification)

```java
    // Bootstrap Admin Pattern inside register():
    boolean isFirstUser = userRepository.count() == 0;
    User user = new User(username, email, hashedPassword);
    if (isFirstUser) {
        user.setRole(UserRole.ROLE_ADMIN);
    }
    userRepository.save(user);
```
* **The Bootstrap Admin Pattern:** Solves the "Chicken and Egg" problem. When the project starts with a fresh empty database, how is the first administrator created?  
  Our code checks: `userRepository.count() == 0`. The very first registered student is automatically elevated to `ROLE_ADMIN`! Every subsequent account defaults to `ROLE_USER`.

```java
    // Password Verification inside login():
    User user = userRepository.findByUsername(username)
            .orElseThrow(() -> new IllegalArgumentException("Invalid username or password"));

    if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
        throw new IllegalArgumentException("Invalid username or password");
    }

    if (user.isBanned()) {
        throw new IllegalArgumentException("This account has been suspended or banned by an administrator.");
    }
```
* **Uniform Error Messages:** Notice that whether the username is not found or the password is wrong, the error message is identical: `"Invalid username or password"`. This prevents **Username Enumeration Attacks** (attackers cannot probe your API to discover which usernames exist).

---

## Part 6: Summary to Explain to Others (Your Auditor Pitch)

When an evaluator asks:  
**"Explain how your security architecture works from the network socket to controller execution."**

Here is your bulletproof response:

> *"Our backend security architecture is built on Spring Security 6 implementing a completely stateless, token-based authentication mechanism.  
> 
> When an HTTP request enters Tomcat, it is intercepted by Spring's `DelegatingFilterProxy` which hands the request to `FilterChainProxy` and our custom `SecurityFilterChain`.  
> 
> The request first traverses our `CorsFilter` to support cross-origin requests from our Angular frontend running on port 4200. CSRF protection is explicitly disabled because our architecture is completely stateless: we use no session cookies (`SessionCreationPolicy.STATELESS`), meaning browser-automated cross-site credential attacks are physically impossible against our `Authorization: Bearer` headers.  
> 
> Next, our custom `JwtAuthFilter` executes prior to Spring's username/password filter. It extracts the JWT, verifies its HMAC-SHA256 signature using our 256-bit secret key, and validates expiration. Crucially, it queries the database for the user's ban status. If the account is flagged as banned, it halts the request immediately with an HTTP 403 `ACCOUNT_BANNED` response, ensuring banned users cannot execute any controller actions.  
> 
> For valid requests, it populates Spring's `SecurityContextHolder` using JVM `ThreadLocal` storage, isolating the user's authentication and granted authorities (`ROLE_USER` or `ROLE_ADMIN`) to the current executing worker thread.  
> 
> Route-level authorization rules in `SecurityConfig` and method-level `@PreAuthorize` annotations ensure that administrative endpoints (`/api/admin/**`) strictly require `ROLE_ADMIN`, while public feeds remain readable. Any authentication or authorization failures are caught by our custom `AuthenticationEntryPoint` and `AccessDeniedHandler`, which return structured JSON error payloads instead of default HTML error pages.  
> 
> Finally, all user passwords are protected using BCrypt with a 16-byte random salt and a cost factor of 10, neutralizing rainbow table and brute force attacks."*

---

## Interactive Q&A & Self-Check for Session 2

Before we conclude Session 2, test yourself on these questions frequently asked by evaluators:

1. **Why does `SecurityContextHolder` use `ThreadLocal` memory storage? What would happen if it used a regular static variable instead?**  
   *Answer:* `ThreadLocal` isolates data to the currently executing Tomcat thread. If it used a regular static variable, every user's login would overwrite the previous user's login globally across the entire server, causing catastrophic identity leakage.

2. **Why is it impossible to execute a CSRF attack against our backend?**  
   *Answer:* CSRF relies on the browser automatically attaching stored cookies to cross-origin requests. Our API is stateless and does not use session cookies; it requires the client to explicitly send an `Authorization: Bearer <token>` header, which browsers never attach automatically.

3. **What is the difference between `AuthenticationEntryPoint` and `AccessDeniedHandler`?**  
   *Answer:* `AuthenticationEntryPoint` handles unauthenticated requests (HTTP 401 - missing or invalid token). `AccessDeniedHandler` handles unauthorized requests from an already authenticated user who lacks the required role (HTTP 403 - e.g. `ROLE_USER` attempting an admin action).

4. **Why are passwords hashed with a salt instead of plain hashing like basic SHA-256?**  
   *Answer:* A salt is a random 16-byte string generated per password. It ensures that identical passwords produce completely different hash outputs, making precomputed Rainbow Table dictionaries useless.

5. **Why can't a hacker tamper with a JWT payload (e.g. changing their username to "admin") and use it?**  
   *Answer:* The token's signature is calculated as `HMAC-SHA256(header + "." + payload, secret)`. If any character in the payload is changed, the signature will no longer match unless the attacker knows the server's private 256-bit secret key from `.env`.

6. **How does our system solve the classic JWT revocation problem for banned users?**  
   *Answer:* Our `JwtAuthFilter` checks `user.isBanned()` in PostgreSQL on every incoming authenticated request. If an admin bans an account, the user is locked out immediately on their next request, rather than waiting 24 hours for the JWT to expire.

---

## 🔬 Deep-Dive Q&A: Filter Ordering Mechanics, ThreadLocal Lifecycles & Integer Sorting

### Q1: What Physically is `filterChain.doFilter(request, response)`?

In [`JwtAuthFilter.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/config/JwtAuthFilter.java#L86), you see this line at the bottom of the method:
```java
filterChain.doFilter(request, response);
```

#### Is `filterChain` a Servlet Filter?
**No. `filterChain` is the Manager that holds the entire ordered array of filters plus an index pointer.**

Think of `filterChain` as an array with an internal integer counter:
```java
// Conceptual view of Spring's ApplicationFilterChain:
public class ApplicationFilterChain implements FilterChain {
    private List<Filter> filters = [CorsFilter, SecurityContextHolderFilter, JwtAuthFilter, UsernamePasswordAuthenticationFilter, AuthorizationFilter];
    private int currentPosition = 0;

    public void doFilter(ServletRequest request, ServletResponse response) {
        if (currentPosition < filters.size()) {
            Filter nextFilter = filters.get(currentPosition++);
            // Pass the baton to the next filter in line!
            nextFilter.doFilter(request, response, this);
        } else {
            // All filters have passed! Finally invoke the Front Controller!
            dispatcherServlet.service(request, response);
        }
    }
}
```

#### What `filterChain.doFilter(request, response)` physically means:
It literally means:  
> *"I (`JwtAuthFilter`) have finished my inspection. I validated the JWT token, confirmed the user is not banned, and stored their identity in this thread's memory.  
> **Now, advance the pointer and pass the baton to the next filter in line!**"*

If you ever **forget** to write `filterChain.doFilter(request, response)`, the request gets stuck in a dead-end and never reaches your Controller or the database!

---

### Q2: How Does Spring Know the Exact Order of Built-in Filters? (The `FilterOrderRegistration` Integer Sorting System)

Beginners often assume filters execute in the order they are typed in `SecurityConfig.java`:
```java
http
    .cors(...)                 // Line 47
    .csrf(...)                 // Line 50
    .sessionManagement(...)    // Line 53
    .authorizeHttpRequests(...)// Line 56
    .addFilterBefore(...)      // Line 86
```

#### The Truth: `SecurityConfig.java` is a Blueprint, NOT the Runtime Order!
That code runs **only once at startup** when you launch `./mvnw`. It does not execute per HTTP request.

Inside Spring Security's engine, there is a class called **`FilterOrderRegistration.java`**. The Spring team assigned a **hardcoded integer number** to every standard filter:

```java
// Conceptual view inside Spring Security's FilterOrderRegistration:
class FilterOrderRegistration {
    private static final int STEP = 100;
    
    // Fixed integer ranks:
    int CORS_FILTER                        = 100;
    int SECURITY_CONTEXT_HOLDER_FILTER     = 300;
    int CSRF_FILTER                        = 500;
    int LOGOUT_FILTER                      = 700;
    ...
    int USERNAME_PASSWORD_AUTH_FILTER      = 1900;  // <-- Default form login filter!
    ...
    int AUTHORIZATION_FILTER               = 3000;  // <-- URL rules check (.authorizeHttpRequests)!
}
```

#### What happens when you call `.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)`:
1. Spring looks up the integer order of `UsernamePasswordAuthenticationFilter.class` ➔ **`1900`**.
2. Because you specified `addFilterBefore`, Spring assigns our `JwtAuthFilter` the rank: **`1899`**!
3. Before Tomcat opens port 8080, Spring takes all active filters in the chain and runs:
   ```java
   filters.sort(Comparator.comparingInt(Filter::getOrder));
   ```
4. **The Sorted Execution Sequence:**
   - Rank 100: `CorsFilter` runs first.
   - Rank 300: `SecurityContextHolderFilter` runs second.
   - Rank 1899: Our `JwtAuthFilter` runs third!
   - Rank 1900: `UsernamePasswordAuthenticationFilter` runs fourth.
   - Rank 3000: `AuthorizationFilter` runs fifth.

**There is zero magic.** It is standard integer sorting (`Collections.sort()`). That is how Spring knows with mathematical certainty who runs before whom.

---

### Q3: The Paradox Resolved: Session Memory vs Request Memory

#### The Apparent Contradiction:
> *"You told me that because of `.sessionManagement(STATELESS)`, Spring stores nothing in session memory. But in JWT you told me: IF VALID, FILLS THE EMPTY SecurityContext WITH USER & ROLES! How can both be true?"*

This is the essential difference between **Session Memory** and **Request Memory**:

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                   TWO COMPLETELY DIFFERENT MEMORY REALMS                          │
├────────────────────────────────────────┬─────────────────────────────────────────┤
│ 1. SESSION MEMORY (HttpSession)        │ 2. REQUEST MEMORY (ThreadLocal Context) │
├────────────────────────────────────────┼─────────────────────────────────────────┤
│ • Analogy: A Hotel Room Rented for     │ • Analogy: A Temporary Visitor Sticker │
│   3 Days.                              │   Badge Worn for 5 Minutes.             │
│                                        │                                         │
│ • Lives in Tomcat RAM across hundreds  │ • Lives in CPU ThreadLocal memory for   │
│   of HTTP requests over hours or days. │   only 5 MILLISECONDS during one call.  │
│                                        │                                         │
│ • Consumes server RAM continuously     │ • Discarded and wiped to null the       │
│   even when the user is idle/sleeping. │   exact microsecond the response exits. │
│                                        │                                         │
│ • BREAKS HORIZONTAL SCALING: If user   │ • SCALES INFINITELY: Any backend server │
│   hits Server B, session is missing!   │   can verify the JWT independently!     │
│                                        │                                         │
│ • STATUS IN 01BLOG: COMPLETELY OFF     │ • STATUS IN 01BLOG: ACTIVE FOR ONLY     │
│   (SessionCreationPolicy.STATELESS)    │   THE 5ms LIFETIME OF THE REQUEST!      │
└────────────────────────────────────────┴─────────────────────────────────────────┘
```

#### The 5-Millisecond Lifecycle:
1. At **0.0ms**: Alice sends `GET /api/posts`. A Tomcat worker thread picks up the request.
2. At **1.0ms**: `SecurityContextHolderFilter` creates an empty `SecurityContext` in `ThreadLocal`.
3. At **2.0ms**: `JwtAuthFilter` validates Alice's JWT and slaps the temporary badge on the thread:
   ```java
   SecurityContextHolder.getContext().setAuthentication(aliceAuthToken);
   ```
4. At **3.5ms**: `AuthorizationFilter` checks the badge: *"Yes, Alice is authenticated."*
5. At **4.0ms**: `PostController` queries the posts for Alice.
6. At **5.0ms**: The JSON response is written to the TCP socket.
7. At **5.1ms**: `SecurityContextHolderFilter` immediately calls:
   ```java
   SecurityContextHolder.clearContext(); // RIPS OFF THE STICKER!
   ```
8. The thread's memory is wiped back to `null`, ready for the next incoming user. Zero memory leaks, zero cross-user contamination!

---

### Q4: Why is `UsernamePasswordAuthenticationFilter` in the Chain if We Use JWT?

You might wonder:  
*"Why does Spring even have `UsernamePasswordAuthenticationFilter` in our chain if our frontend is Angular and we don't use HTML login forms?"*

1. **The Landmark Slot:** In Spring Security's architecture, `UsernamePasswordAuthenticationFilter` (order 1900) is the official anchor point where authentication happens. We use it as the reference target for `.addFilterBefore(jwtAuthFilter, ...)`.
2. **What it does at runtime:**  
   When `JwtAuthFilter` passes the baton, `UsernamePasswordAuthenticationFilter` executes:
   ```java
   // Inside Spring's UsernamePasswordAuthenticationFilter:
   if (!requiresAuthentication(request, response)) {
       chain.doFilter(request, response); // NOT A FORM LOGIN! PASS IMMEDIATELY!
       return;
   }
   ```
3. Because our Angular frontend sends REST JSON and does not submit traditional form-encoded POSTs to `/login`, `UsernamePasswordAuthenticationFilter` immediately realizes it has no work to do.
4. It calls `chain.doFilter()` and steps aside in less than **0.0001 milliseconds**. It causes zero lag and zero interference with our JWT workflow.

---

### Q5: What Does "Spring MVC" Mean in a REST API, and Why Does `.anyRequest().permitAll()` Enable Clean 404s?

In [`SecurityConfig.java`](file:///c:/Users/Rachid/01blog/backend/src/main/java/com/zone01/blog/config/SecurityConfig.java#L67-L68), you see:
```java
// Unknown API routes fall through so Spring MVC can cleanly return standard 404 JSON
.anyRequest().permitAll()
```

#### 1. What Does "Spring MVC" Actually Mean Here?
In Java and Spring Boot, the web framework module responsible for URL routing, `@RestController`, `@GetMapping`, and `DispatcherServlet` is officially named **`spring-webmvc`**.

Even though we are building a decoupled REST API with Angular (and not rendering server-side HTML views), Spring still uses the **MVC** architecture internally:
* **M (Model):** Our entity and DTO data objects (`Post.java`, `PostResponse.java`, `User.java`).
* **V (View):** The serialized **JSON text string** generated by the Jackson library and sent over the network pipe to Angular.
* **C (Controller):** Our `@RestController` classes (`PostController`, `AuthController`).
* **Front Controller:** `DispatcherServlet` (the hotel receptionist that routes URLs to controller methods).

#### 2. The Two Independent Checkpoint Zones:
```
[ Incoming Request: GET /api/xyz-does-not-exist ]
                         │
                         ▼
   ╔════════════════════════════════════════════════════╗
   ║  ZONE 1: SPRING SECURITY (The Security Guard)      ║
   ║  - Handled by: AuthorizationFilter                 ║
   ║  - Only cares about: "ARE YOU ALLOWED IN?"         ║
   ║  - Knows NOTHING about which controller exists!    ║
   ╚════════════════════════════════════════════════════╝
                         │
                         │ (Allowed through the gate)
                         ▼
   ╔════════════════════════════════════════════════════╗
   ║  ZONE 2: SPRING MVC (The Receptionist & Offices)   ║
   ║  - Handled by: DispatcherServlet                   ║
   ║  - Only cares about: "DOES THIS OFFICE EXIST?"     ║
   ║  - Looks at HandlerMapping to find the Controller  ║
   ╚════════════════════════════════════════════════════╝
```

#### 3. Why `.anyRequest().permitAll()` is Crucial for Proper HTTP 404s:

Suppose an unauthenticated user or an automated bot requests an endpoint that does not exist at all on the server:
`GET http://localhost:8080/api/non-existent-page`

##### Scenario A: If we had configured `.anyRequest().authenticated()` ❌
1. The request enters **Spring Security** (Zone 1).
2. The URL `/api/non-existent-page` does not match `/api/auth/**`.
3. It hits the fallback: `.anyRequest().authenticated()`.
4. Spring Security says: *"You have no token! Blocked!"*
5. Spring Security halts the request and returns **`HTTP 401 UNAUTHORIZED`**.
6. **Why this is wrong:** The URL doesn't even exist! Returning `401 Unauthorized` tricks the client into thinking the endpoint exists and that logging in will make it work.

##### Scenario B: With `.anyRequest().permitAll()` ✅ (Our Implementation)
1. The request enters **Spring Security** (Zone 1).
2. We have already explicitly locked down all our genuine API endpoints above:
   - `/api/admin/**` requires `ROLE_ADMIN`.
   - `/api/posts/**`, `/api/users/**`, `/api/reports/**` require authentication.
3. The unknown URL `/api/non-existent-page` falls through to `.anyRequest().permitAll()`.
4. Spring Security says: *"I have no security rule barring this path. Pass through to the web engine."*
5. The request reaches **Spring MVC (`DispatcherServlet`)** (Zone 2).
6. `DispatcherServlet` checks its `HandlerMapping` directory. It finds **no controller method** mapped to `/api/non-existent-page`.
7. Spring MVC correctly reports: *"This endpoint does not exist on this server."*
8. The server cleanly returns: **`HTTP 404 NOT FOUND`**!

---

### Q6: Why is `RateLimitFilter` Placed Before `LogoutFilter` Instead of After `JwtAuthFilter`?

In `SecurityConfig.java`, we wrote:
```java
.addFilterBefore(rateLimitFilter, org.springframework.security.web.authentication.logout.LogoutFilter.class)
.addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
```

#### The Evaluator's Question:
*"Why did you put your RateLimitFilter so early in the chain, right before LogoutFilter? Why didn't you put it after JwtAuthFilter so you know who the user is before limiting them?"*

#### The Defense:
1. **The CPU Conservation Principle (Fail Fast & Cheap):**
   - In Spring Security, `LogoutFilter` sits near the very top of the filter chain (order index ~500), immediately after `CorsFilter`.
   - `JwtAuthFilter` performs cryptographic HMAC-SHA256 signature verification and queries PostgreSQL (`userRepository.findByUsername()`) to inspect if the account is banned.
   - If an attacker launches a Denial-of-Service (DoS) or brute-force attack with 10,000 requests per second, placing `RateLimitFilter` **after** `JwtAuthFilter` would force the CPU to calculate 10,000 cryptographic hashes and open 10,000 database queries *before* blocking the attacker!
   - By placing `RateLimitFilter` before `LogoutFilter`, abusive traffic is dropped at the front door with an instantaneous HTTP 429 response, expending almost 0 CPU and 0 database connections.

---

### Q7: How Does `RateLimitFilter` Prevent Memory Leaks in JVM RAM When Tracking Client IPs?

#### The Evaluator's Question:
*"You are storing IP addresses in a `ConcurrentHashMap` in memory. If our server runs for 6 months and 500,000 different bots hit the website, won't your server crash with an `OutOfMemoryError`?"*

#### The Defense:
1. **The Risk:**
   - In a naive implementation, every unique IP creates a new entry in `clientTrackers`. If old entries are never deleted, the Map stays in the JVM Old Generation heap until the JVM runs out of memory (`java.lang.OutOfMemoryError`).
2. **Our Solution (Active Garbage Pruning):**
   - Inside `isAllowed()`, we implemented a self-cleaning threshold guard:
     ```java
     if (clientTrackers.size() > 500) {
         clientTrackers.entrySet().removeIf(e -> now - e.getValue().windowStart > WINDOW_MS);
     }
     ```
   - When the tracker contains more than 500 entries, it iterates and instantly purges any entry whose 60-second window has expired (`now - windowStart > 60_000ms`).
   - This caps the memory footprint to a negligible few kilobytes of RAM regardless of how long the server runs or how many distinct IP addresses connect.

---

### Q8: How Does `VirtualFilterChain` Physically Pass the Baton in Memory? (The `currentPosition` Counter)

![01Blog Inside JVM Memory: VirtualFilterChain in Action](docs/images/01blog_virtual_filter_chain_internals.jpg)

#### The Evaluator's Question:
*"In your code, you invoke `filterChain.doFilter(request, response)`. But `FilterChain` is just an interface. How does Java actually know how to move from `RateLimitFilter` to `JwtAuthFilter` and then to `DispatcherServlet`? Where does the baton go?"*

#### The Defense:
1. **The Architecture Bridge:**
   - **Tomcat** receives the raw HTTP request on TCP port 8080 and passes it to **`DelegatingFilterProxy`** (a standard servlet filter).
   - **`DelegatingFilterProxy`** bridges into the Spring IoC container and delegates to the master bean: **`FilterChainProxy`** (bean name `"springSecurityFilterChain"`).
2. **The `VirtualFilterChain` in JVM RAM:**
   - `FilterChainProxy` matches the URL against our `SecurityFilterChain` bean from `SecurityConfig.java`.
   - It instantiates an internal private class: **`VirtualFilterChain`**, which implements standard `jakarta.servlet.FilterChain`.
   - Inside `VirtualFilterChain`'s memory structure, there is:
     1. A `List<Filter>` containing all configured filters in exact order:
        `[0: CorsFilter, 1: RateLimitFilter, 2: CsrfFilter, 3: SecurityContextHolderFilter, 4: JwtAuthFilter, 5: UsernamePasswordAuthFilter, 6: AuthorizationFilter]`
     2. An integer counter: `int currentPosition = 0;`
3. **The Step-by-Step Baton Pass:**
   - Every time a filter calls `filterChain.doFilter(request, response)`:
     ```java
     this.currentPosition++;
     Filter nextFilter = this.filters.get(this.currentPosition - 1);
     nextFilter.doFilter(request, response, this); // 'this' passes the VirtualFilterChain itself as the baton!
     ```
   - When `RateLimitFilter` finishes its checks and calls `filterChain.doFilter()`, `currentPosition` increments to `2`, grabbing `CsrfFilter`... until reaching `JwtAuthFilter` at position `4`.
4. **Reaching the Destination (`DispatcherServlet`):**
   - When `currentPosition == this.filters.size()`, all security checkpoints have passed.
   - `VirtualFilterChain` calls the original Tomcat filter chain (`originalChain.doFilter()`), which hands the request directly to **`DispatcherServlet`** ➔ **`PostController`**!

---

### Q9: Why Does `doFilterInternal` Declare `throws ServletException, IOException`? (`throw` vs `throws`)

In both `RateLimitFilter.java` and `JwtAuthFilter.java`, the method signature declares:
```java
@Override
protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
) throws ServletException, IOException {
    // All normal logic runs here!
}
```

#### The Evaluator's Question:
*"Why is your entire filter logic placed inside a method that says `throws ServletException, IOException`? Are you throwing an error? What does `throws` actually mean here?"*

#### The Defense:
1. **The Fundamental Distinction: `throw` vs `throws`:**
   - **`throw` (The Action):** An imperative statement that actively creates and tosses an exception into the call stack (e.g., `throw new RuntimeException("Error")`).
   - **`throws` (The Contract/Warning Label):** A method declaration disclaimer that tells the Java compiler: *"This method performs operations that could encounter checked exceptions. I am not catching them here; let the caller (Tomcat) handle them."*
2. **The Physical Network Reality (Checked Exceptions):**
   - An HTTP request represents a live **TCP network socket**.
   - If a client abruptly disconnects, loses Wi-Fi signal, or closes their browser tab mid-flight, attempting to read the header (`request.getHeader()`) or write response bytes (`response.getWriter().write(...)`) causes the underlying operating system socket to fail with a **`java.io.IOException`**.
   - In Java, `IOException` and `ServletException` are **Checked Exceptions**. The compiler enforces a strict rule: you must either wrap every single network line in boilerplate `try-catch` blocks, or declare `throws` on the method signature.
3. **Clean Architecture:**
   - By declaring `throws ServletException, IOException`, our filter logic remains clean and readable without redundant try-catch clutter.
   - If an unexpected network break occurs, the exception cleanly bubbles up to Apache Tomcat to safely terminate and recycle the worker thread socket.



