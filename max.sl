(set-logic LIA)

;; Name and signature of the function to be synthesized
(synth-fun max2 ((x Int) (y Int)) Int
    
    ;; Declare the non-terminals that would be used in the grammar
    ((I Int) (B Bool))

    ;; Define the grammar for allowed implementations of max2
    ((I Int (x y 0 1
             (+ I I) (- I I)
             (ite B I I)))
     (B Bool ((and B B) (or B B) (not B)
              (= I I) (<= I I) (>= I I))))
)

(declare-var x Int)
(declare-var y Int)

;; Define the semantic constraints on the function
(constraint (= (max2 0 2) 2))
(constraint (= (max2 2 0) 2))
(constraint (= (max2 3 1) 3))
(constraint (= (max2 3 6) 6))

(check-synth)
