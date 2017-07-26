Public Module thisModule
    Const i1_OK = 12_34_5%
    Const i2_OK = &ha_BC_d23_8&
    Const i3_OK = &O42_7i
    Const i4_OK = &B01_1_0l
    Const i5_OK = +123S
    Const i6_OK = -123UI
    Const i7_OK = +123uL
    Const i8_OK = -123us
    Const i9_OK = 2398

    Const i1_ERROR = _123  ' This should be an identifier.
    Const i2_ERROR = 123_  ' _ is an invalid identifier (still highlighted)

    Const f1_OK = 1F
    Const f2_OK = 2.0E3R
    Const f3_OK = .3E+8D
    Const f4_OK = 4E-9
    Const f5_OK = 5___2.3_1_3e-4_6_4!
    Const f6_OK = 6.2#
    Const f7_OK = 7@
End Module
