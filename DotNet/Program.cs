using System;
using System.Linq;

namespace DListDecode
{
    class Program
    {
        static void Main()
        {
            const int modeMask = 0b00001111;
            const int DLIMask = 0b10000000;
            const int LMSMask = 0b01000000;
            const int VScroll = 0b00100000;
            const int HScroll = 0b00010000;
            const int JVB = 0x41;
            const int JMP = 0x01;

            var Dlist = "$B0,112,$70,$D6,$00,$30,$10,$D4,$00,$31";
            Dlist += ",$D4,$80,$30,$D4,$80,$30,$D4,$40,$37,$D4";
            Dlist += ",$C0,$35,$D4,$40,$33,$D4,$C0,$35,$D4,$40";
            Dlist += ",$33,$D4,$C0,$37,$D4,$00,$35,$D4,$80,$30";
            Dlist += ",$D4,$80,$30,$D4,$80,$30,$D4,$00,$3A";
            Dlist += ",$84,$84,$84,$84,$84,$84,$84,$84";
            Dlist += ",$20,$52,$00,$00,$41,$00,$00";

            // var Dlist = "$70,$70,$70,$70,$70,$44,0,$40,$04,$04,$04,$04,$70,$86";
            // Dlist += ",$01,0,0";
            // Dlist += ",$70,$70,$70,$70,$70,$06,$70,$70,$70,$70,$70,$70,$70,$70,$70";
            // Dlist += ",$41,0,$20";

            // var Dlist = "$70,$70,$70";
            // Dlist += ",$46,$00,$40  ";
            // Dlist += ",6            ";
            // Dlist += ",$70          ";
            // Dlist += ",7,7,7,7,7    ";
            // Dlist += ",$70          ";
            // Dlist += ",2            ";
            // Dlist += ",$70,$70,$70  ";
            // Dlist += ",2,4          ";
            // Dlist += ",$70          ";
            // Dlist += ",2,5          ";
            // Dlist += ",$41,0,0";

            var ByteChars = Dlist.Replace(" ", "").Split(",");

            var Bytes = ByteChars.Select(s =>
            {
                if (s.Substring(0, 1) == "$")
                    return Convert.ToInt32(s.Substring(1), 16);
                else
                    return Convert.ToInt32(s);
            }).ToArray();

            var pos = 0;
            while (pos < Bytes.Length)
            {
                var b = Bytes[pos];

                var mode = b & modeMask;
                var isDLI = (b & DLIMask) == DLIMask;
                var isLMS = (b & LMSMask) == LMSMask;
                var isHScroll = (b & HScroll) == HScroll && mode != 0;
                var isVScroll = (b & VScroll) == VScroll && mode != 0;
                var isJVB = b == JVB;
                var isJMP = b == JMP;
                var bLines = ((b & 0b01110000) >> 4) + 1;

                Console.Write($"{b,3}  ${b:X2} : ");
                if (isJVB)
                {
                    Console.Write("JVB ");
                    if (isDLI)
                        Console.Write("DLI ");
                    var addr = Bytes[pos + 1] + Bytes[pos + 2] * 256;
                    pos += 3;
                    Console.WriteLine($"${addr:X4} ");
                    continue;
                }
                if (isJMP)
                {
                    Console.Write("JMP ");
                    if (isDLI)
                        Console.Write("DLI ");
                    var addr = Bytes[pos + 1] + Bytes[pos + 2] * 256;
                    pos += 3;
                    Console.WriteLine($"${addr:X4} ");
                    continue;
                }
                if (mode == 0)
                    Console.Write($"{bLines} Blank lines ");
                if (isLMS && mode != 0)
                {
                    Console.Write("LMS ");
                    var addr = Bytes[pos + 1] + Bytes[pos + 2] * 256;
                    pos += 2;
                    Console.Write($"${addr:X4} ");
                }
                if (isHScroll)
                    Console.Write("HSCROLL ");
                if (isVScroll)
                    Console.Write("VSCROLL ");
                if (isDLI)
                    Console.Write("DLI ");
                if (mode >= 2 && mode <= 7)
                    Console.Write($"Text mode {mode} ");
                if (mode >= 8 && mode <= 15)
                    Console.Write($"Gr. mode {mode} ");

                Console.WriteLine();
                pos += 1;
            }

        }
    }
}
