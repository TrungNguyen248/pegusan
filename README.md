## Router list

#### -----------/v1/api-------------

-   (D)-- - /user/signup POST
-   (D)-- - /user/login POST
-   (D)-- - /user/logout POST
-   (D)-- - /user/handlerRefreshToken POST (handler refresh token -> gen new accesstoken if expired)

#### ---------/v1/api/course-----------

-   (D)-- - / POST (Create Course)
-   (D)-- - /all POST (Get all course)
-   (D)-- - /edit/:id PATCH (update, edit ==> update time, ...)
-   -- - /delete/:id DELETE (Delete if empty) ( => later)

#### ---------/v1/api/lesson-----------

-   (D)-- - /:lesson_id POST (Get one lesson by id)
-   (D)-- - /all/:course_id POST (Get all lesson by id course)
-   (D)-- - /create/:course_id POST (Create Lesson)
-   (D)-- - /update/:course_id/:id PATCH (update, edit title ==> update time, ...)
-   -- - /delete/:course_id/:id DELETE (Delete if lesson empty ( => later))
-   (D)-- - /release/:id POST (Release lesson (isRelease -> true))
-   (D)-- - /unRelease/:id POST (Unrelease lesson (isRelease -> false))

#### ---------/v1/api/vocab-----------

-   (D)-- - /add/:lesson_id POST (Add vocab by lesson id)
-   (D)-- - /all/:lesson_id POST (Get all vocab by lesson id)
-   (D)-- - /update/:lesson_id/:id PATCH (update vocab file, meaning, ...)
-   -- - /delete/:id DELETE (Delete vocab)

#### ---------/v1/api/grammar-----------

-   -- - /add/:lesson_id POST (Add grammar by lesson id)
-   -- - /all/:lesson_id POST (Get all grammar by lesson id)
-   -- - /update/:lesson_id/:id PATCH (update grammar, ...)
-   -- - /delete/:id DELETE (Delete grammar)

#### ---------Query------------

-   (D)-- - /course/drafts/all GET (Get all draft lesson)
-   (D)-- - /course/:course_id/releases/all GET (Get all releases lesson)
