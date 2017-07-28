#include <iostream>
using namespace std;

float Perimeter(float l, float w) {
    double p;

    p = 2 * (l + w);
    return p;
}

//http://hg.mozilla.org/tracemonkey/file/dc6ce44bedd4/chrome/src/nsChromeRegistry.cpp
void
nsChromeRegistry::LogMessageWithContext(nsIURI* aURL, PRUint32 aLineNumber, PRUint32 flags,
                                        const char* aMsg, ...)
{
  nsresult rv;

  nsCOMPtr<nsIConsoleService> console 
    (do_GetService(NS_CONSOLESERVICE_CONTRACTID));

  nsCOMPtr<nsIScriptError> error
    (do_CreateInstance(NS_SCRIPTERROR_CONTRACTID));
  if (!console || !error)
    return;

  va_list args;
  va_start(args, aMsg);
  char* formatted = PR_vsmprintf(aMsg, args);
  va_end(args);
  if (!formatted)
    return;

  nsCString spec;
  if (aURL)
    aURL->GetSpec(spec);

  rv = error->Init(NS_ConvertUTF8toUTF16(formatted).get(),
                   NS_ConvertUTF8toUTF16(spec).get(),
                   nsnull,
                   aLineNumber, 0, flags, "chrome registration");
  PR_smprintf_free(formatted);

  if (NS_FAILED(rv))
    return;

  console->LogMessage(error);
}

int regexStuff() {
    std::regex phoneRegex(R"(\d{3}-\d{4})");
    std::string input = "Jenny: 867-5309";

    auto cur = input.begin(), end = input.end();
    std::smatch phoneMatch;
    while (std::regex_search(cur, end, phoneMatch, phoneRegex) {
        std::cout << "I got it: " << phoneMatch.str() << std::endl;
        cur = phoneMatch[0].second;
    }
}

class IntList {
    public:
        IntList();
        void AddToEnd(int k);
        void Print(ostream &output) const;

    private:
        static const int SIZE = 10;
        int *Items;
        int numItems;
        int arraySize;
};

class CRectangle {
    int width, height;
    public:
        int area() {
            lolPointer * myPointer = (pointerCast*)cast;
            lolPointer2** anotherPointer;
            other myPointer = (regularCast)cast;
            padd = (ReferenceCast*)&d;
            int result = firstIdent1 * secondIdent1;
            result = (firstIdent2 * secondIdent2);
            result = firstIdent3 & secondIdent3;
            result = (firstIdent4 & secondIdent4);
        }

        void convert(CSquare a);
};

class CSquare {
    private:
        int side;
    public:
        void set_side(int a) {
            side = a;
        }

        friend class CRectangle;
};

void CRectangle::convert(CSquare a) {
    width = a.side;
    height = a.side;
}

template <typename T>
inline T const& max(T const& a, T const& b) {
    // if a < b then use b else use a
    return  a < b ? b : a;
}

template <class T, int N>
void mysequence<T, N>::setmember(int x, T value) {
    memblock[x] = value;
}

template <class MyTemplateClass, int N>
T mysequence<T, N>::getmember(int x) {
    return memblock[x];
}

