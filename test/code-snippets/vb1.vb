Imports System.Runtime.InteropServices

'comment

''' <summary>
''' How about an XML doc comment?
''' This class does <c cref="Foo">something</c>
''' </summary>
'''
''' <param name="foos">Collection of <see cref="Foo" /></param>
<Attribute1("DEBUG"), Attribute2("TEST1")>
<System.Runtime.InteropServices.DllImport("user32.dll")>
Public Class thisClass(Of t As {GenericConstraint1, GenericConstraint2, Class, New})
    ' Insert code that defines class members.
End Class

Public Class Dictionary(Of entryType, keyType As IComparable)
    Public Sub add(<[In](), ICanHazAttribute()>ByVal e As entryType, ByVal k As keyType)
        Dim dk As keyType

        'array initialization and char literals
        Dim testChars As Char() = New Char(2) {"%"c, "&"c, "@"c}

        'casting stuff
        f = CType(CType(castVar1, OohNestedCast), CastToThisType)
        f = DirectCast(castVar2, NoCastToThisType)
        f = CType(castVar3, CastToArray())
        Dim objAsConvertible As IConvertible = TryCast(castVar4, TryToCastToThisType)

        MsgBox(GetType(GetTypeTest).ToString())

        If k.CompareTo(dk) = 0 Then
        End If
    End Sub
    Public Function find(ByVal k As keyType) As entryType
    End Function
End Class


Public Class ThisClass
    Inherits BaseClass
    Implements IInterface1, IInterface2, IInterface3

    Sub New(ByVal SomeValue As Integer)
        ' Call MyBase.New if this is a derived class.
        MyBase.New()
        MsgBox("ThisClass is initializing with Sub New.")
        ' Place initialization statements here.
        ThisPropertyValue = SomeValue
    End Sub

    Private ThisPropertyValue As Integer
    Property ThisProperty() As Integer
        Get
            CheckIfDisposed()
            ThisProperty = ThisPropertyValue
        End Get
        Set(ByVal Value As Integer)
            CheckIfDisposed()
            ThisPropertyValue = Value
        End Set
    End Property

    Private disposed As Boolean = False
    Public Sub CheckIfDisposed()
        If Me.disposed AndAlso True Then
            Throw New ObjectDisposedException(Me.GetType().ToString, _
            "This object has been disposed.")
        End If
    End Sub
End Class

Delegate Function MathOperator(
    ByVal x As Double,
    ByVal y As Double
) As Double

Function AddNumbers(
    ByVal x As Double,
    ByVal y As Double
) As Double
    Return x + y
End Function

Function SubtractNumbers(
    ByVal x As Double,
    ByVal y As Double
) As Double
    Return x - y
End Function

Sub DelegateTest(
    ByVal x As Double,
    ByVal op As MathOperator,
    ByVal y As Double
)
    Dim ret As Double
    ret = op.Invoke(x, y) ' Call the method.
    MsgBox(ret)
End Sub

Protected Sub Test()
    DelegateTest(5, AddressOf AddNumbers, 3)
    DelegateTest(9, AddressOf SubtractNumbers, 3)
End Sub

Public Interface thisInterface
    Property thisProp(ByVal thisStr As String) As Char
    Function thisFunc(ByVal thisInt As Integer) As Integer
End Interface

Public Structure employee
    Public firstName As String
    Public middleName As String
    Const maximum As Long = 459
    Friend Sub calculateBonus(ByVal rate As Single)
        bonus = salary * CDbl(rate)
    End Sub
    ' Property member to return employee's eligibility.
    Friend ReadOnly Property eligible() As Boolean
        Get
            Return level >= 25
        End Get
    End Property
    ' Event member, raised when business phone number has changed.
    Public Event changedWorkPhone(ByVal newPhone As Long)
End Structure

Public Module thisModule
    Sub Main()
        Dim [True] As String = InputBox("What is your name?")
        MsgBox("User name is" & [True])
    End Sub
    ' Insert variable, property, procedure, and event declarations.
End Module

Public Enum InterfaceColors
    MistyRose = &HE1E4FF
    SlateGray = &H908070
    DodgerBlue = &HFF901E
    DeepSkyBlue = &HFFBF00
    SpringGreen = &H7FFF00
    ForestGreen = &H228B22
    Goldenrod = &H20A5DA
    Firebrick = &H2222B2
End Enum
