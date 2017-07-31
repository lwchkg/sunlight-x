;;; Count and collect names and ages.
(loop for name in '(fred sue alice joe june)
      as age in '(22 26 19 20 10)
      append (list name age) into name-and-age-list
      count name into name-count
      sum age into total-age
      finally
        (return (values (round total-age name-count)
                        name-and-age-list)))

; special form and constant
(setq x (+ 3 2 1) y (cons x nil))

; type
(series 'b 'c) => #Z(b c b c b c ...)
(scan (list 'a 'b 'c)) => #Z(a b c)

; declaration specifier
(defun simple-collect-sum (numbers)
  (declare (optimizable-series-function 1))
  (collect-fn 'number #'(lambda () 0) #'+ numbers))

; global variables
(let ((*print-right-margin* 25) (*print-lines* 3))
  (pprint '(progn (setq a 1 b 2 c 3 d 4))))


#2A((0 1 5) (foo #4r4056 (hot dog)))

; user-defined variable
(setf *temp* (function *))

; keyword arguments
(write foo
   :pretty t
   :right-margin 60
   :case :downcase)

;;; cl-typesetting copyright 2003-2004 Marc Battyani see license.txt for the details
;;; You can reach me at marc.battyani@fractalconcept.com or marc@battyani.net
;;; The homepage of cl-typesetting is here: http://www.fractalconcept.com/asp/html/cl-typesetting.html

(in-package #:typeset)

;;; This is a module to typeset Common Lisp code with some syntax coloring
;;; The syntax coloring is too simple to be 100% accurate:
;;; Improvements welcomed!

(defparameter *pp-font-size* 9)
(defparameter *pp-default-decoration* '("courier" (0.0 0.0 0.0)))
(defparameter *pp-keyword-decoration* '("courier" (0.8 0.0 0.0)))
(defparameter *pp-common-lisp-decoration* '("courier" (0.0 0.0 0.4)))
(defparameter *pp-string-decoration* '("courier" (0.0 0.5 0.0)))
(defparameter *pp-comment-decoration* '("courier" (0.2 0.2 0.6)))
(defparameter *pp-symbol-decoration-table* (make-hash-table))

(defparameter *exceptions* '())

(defun add-symbol-decoration (symbol decoration)
  (setf (gethash symbol *pp-symbol-decoration-table*) decoration))

;(loop for (symbol . decoration) in '((defvar "courier-bold" (0.0 0.0 0.5))
;                                     (defun "courier-bold" (0.0 0.2 0.5))
;                                     (defmethod "courier-bold" (0.0 0.2 0.5)))
;      do (add-symbol-decoration symbol decoration))

(loop for symbol being the external-symbols of 'common-lisp
      when (eql (search "DEF" (symbol-name symbol)) 0)
      do (add-symbol-decoration symbol '("courier-bold" (0.0 0.2 0.5))))

(defun split-comment (line)
  (let ((comment-pos (position #\; line)))
    (if comment-pos
        (values (subseq line 0 comment-pos)(subseq line comment-pos))
        line)))

(defun clean-line (line)
  (setf line (copy-seq line))
  (map-into line #'(lambda (char)
                     (if (find char "()'`#      ")
                         #\Space
                         char))
            line))

(defun process-lisp-line (line)
  (multiple-value-bind (code comment)(split-comment line)
    (let* ((cleaned-line (clean-line code))
           (cl-package (find-package 'common-lisp))
           (decorations '())
           (start 0)
           (trimmed 0)
           (length (length cleaned-line)))
      (iter
       (setf trimmed (position #\Space cleaned-line :start start :test #'char/=))
       (while (and trimmed (< trimmed length)))
       (for (values obj end) = (ignore-errors
                                 (read-from-string
                                  cleaned-line nil nil
                                  :start trimmed :preserve-whitespace t)))
       (unless (numberp end)
         (setf end (position #\Space cleaned-line :start trimmed :test #'char=)))
       (while (and (numberp end) (< end length)))
       (cond ((keywordp obj)
              (push (list* trimmed end *pp-keyword-decoration*) decorations))
             ((stringp obj)
              (push (list* trimmed end *pp-string-decoration*) decorations))
             ((gethash obj *pp-symbol-decoration-table*)
              (push (list* trimmed end (gethash obj *pp-symbol-decoration-table*)) decorations))
             ((and (symbolp obj)
                   (or (eq (symbol-package obj) cl-package)
                       (member (symbol-name obj)
                               '("FOR" "THEN" "WHILE" "COLLECT" "IN" "WITH" "FINALLY")
                               :test #'string=))
                   (not (member (symbol-name obj) *exceptions* :test #'string=)))
              (push (list* trimmed end *pp-common-lisp-decoration*) decorations)))
       (setf start end))
      (setf start 0)
      (loop for (start-tok end-tok font-name color) in (nreverse decorations) do
            (when (/= start start-tok)
              (with-text-compilation
                  (verbatim (subseq line start start-tok))))
            (with-text-compilation
                (with-style (:font font-name :font-size *pp-font-size* :color color)
                  (verbatim (subseq line start-tok end-tok))))
            (setf start end-tok))
      (with-text-compilation
        (when (< start length)
          (verbatim (subseq code start)))
        (with-style (:font (first *pp-comment-decoration*)
                           :font-size *pp-font-size*
                           :color (second *pp-comment-decoration*))
            (verbatim comment)
            (when (zerop length) (verbatim " ")) :eol)))))

(defmethod process-lisp-code ((s stream))
  (with-text-compilation
      (paragraph (:h-align :left :top-margin 10
                  :left-margin 5 :right-margin 5
                  :font "courier" :font-size *pp-font-size*)
                 (loop for line = (read-line s nil)
                       while line
                       do (with-text-compilation
                              (process-lisp-line line))))))

(defmethod process-lisp-code ((lisp-file pathname))
  (with-open-file (s lisp-file :direction :input)
    (process-lisp-code s)))

(defmethod process-lisp-code ((lisp-string string))
  (with-input-from-string (s lisp-string)
    (process-lisp-code s)))

(defmethod process-lisp-code ((sexpr t))
  (process-lisp-code
   (with-output-to-string (s)
     (pprint sexpr s))))

(defun pprint-lisp-file (lisp-code pdf-file &optional title *exceptions*)
  (with-document ()
    (let* ((margins '(30 50 30 50))
           (print-stamp (multiple-value-bind (second minute hour date month year)
                            (get-decoded-time)
                          (declare (ignore second))
                          (format nil "Printed on ~4D-~2,'0D-~2,'0D ~2,'0D:~2,'0D"
                                  year month date hour minute)))
           (header (compile-text ()
                        (paragraph (:h-align :center
                                    :font "Helvetica-BoldOblique" :font-size 12)
                                   (put-string (cond
                                                 (title title)
                                                 ((pathnamep lisp-code)(namestring lisp-code))
                                                 (t "Lisp Source Code"))))
                        (vspace 1)
                        (hrule :dy 0.5)))
           (footer (lambda (pdf:*page*)
                     (compile-text (:font "Helvetica" :font-size 10)
                          (hrule :dy 1/2)
                          (hbox (:align :center :adjustable-p t)
                                (verbatim print-stamp)
                                :hfill
                                (verbatim
                                 (format nil "Page ~d" pdf:*page-number*))))))
           (content (compile-text () (process-lisp-code lisp-code))))
      (draw-pages content :margins margins :header header :footer footer)
      (when pdf:*page* (finalize-page pdf:*page*))
      (pdf:write-document pdf-file))))
