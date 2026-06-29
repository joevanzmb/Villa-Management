import { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface DateRangePickerProps {
    checkIn: string | null;
    checkOut: string | null;
    onChange: (checkIn: string | null, checkOut: string | null) => void;
    bookedDates?: string[];
    popupPosition?: 'top' | 'bottom';
}

export default function DateRangePicker({ checkIn, checkOut, onChange, bookedDates = [], popupPosition = 'top' }: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [hoverDate, setHoverDate] = useState<Date | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Initialize currentMonth to checkIn if available
    useEffect(() => {
        if (checkIn && isOpen) {
            setCurrentMonth(new Date(checkIn));
        }
    }, [checkIn, isOpen]);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

    const generateDays = () => {
        const days = [];
        const prevMonthDays = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 0).getDate();
        
        // Tanggal dari bulan sebelumnya
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, prevMonthDays - firstDayOfMonth + i + 1),
                isCurrentMonth: false
            });
        }
        
        // Tanggal bulan saat ini
        for (let i = 1; i <= daysInMonth; i++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), i),
                isCurrentMonth: true
            });
        }
        
        // Tanggal dari bulan selanjutnya (hanya melengkapi baris terakhir)
        const totalCellsSoFar = days.length;
        const remainder = totalCellsSoFar % 7;
        const cellsToAdd = remainder === 0 ? 0 : 7 - remainder;
        
        for (let i = 1; i <= cellsToAdd; i++) {
            days.push({
                date: new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, i),
                isCurrentMonth: false
            });
        }
        
        return days;
    };

    const isDateBooked = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        const dateStr = `${y}-${m}-${d}`;
        return bookedDates.includes(dateStr);
    };

    const isDatePast = (date: Date) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };

    const handleDateClick = (date: Date) => {
        if (isDatePast(date) || isDateBooked(date)) return;

        const dateString = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

        if (!checkIn) {
            onChange(dateString, null);
        } else if (checkIn && !checkOut) {
            const checkInDate = new Date(checkIn);
            if (date <= checkInDate) {
                // If clicked date is before or equal to check-in, reset check-in to this date
                onChange(dateString, null);
            } else {
                // Validate if any booked date falls between checkIn and selected checkOut
                let hasBookedBetween = false;
                let current = new Date(checkInDate);
                current.setDate(current.getDate() + 1);
                while (current < date) {
                    if (isDateBooked(current)) {
                        hasBookedBetween = true;
                        break;
                    }
                    current.setDate(current.getDate() + 1);
                }

                if (hasBookedBetween) {
                    // Reset to new check in
                    onChange(dateString, null);
                } else {
                    onChange(checkIn, dateString);
                    setIsOpen(false);
                }
            }
        } else {
            // Both are selected, start over
            onChange(dateString, null);
        }
    };

    const getDayClasses = (dayObj: { date: Date, isCurrentMonth: boolean }) => {
        const { date: day, isCurrentMonth } = dayObj;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const dateStr = `${day.getFullYear()}-${String(day.getMonth() + 1).padStart(2, '0')}-${String(day.getDate()).padStart(2, '0')}`;
        const isBooked = isDateBooked(day);
        const isPast = day < today;
        const isDisabled = isBooked || isPast;

        let classes = 'w-10 h-10 flex items-center justify-center rounded-full text-sm font-medium transition-all duration-200 ';

        if (!isCurrentMonth) {
            classes += 'opacity-40 ';
        }

        if (isDisabled) {
            classes += 'text-gray-300 cursor-not-allowed line-through decoration-gray-300';
            return classes;
        }

        const isCheckIn = checkIn && dateStr === checkIn;
        const isCheckOut = checkOut && dateStr === checkOut;

        const dTime = day.getTime();
        const ciTime = checkIn ? new Date(checkIn).getTime() : null;
        const coTime = checkOut ? new Date(checkOut).getTime() : null;
        const hoverTime = hoverDate ? hoverDate.getTime() : null;

        let inRange = false;
        if (ciTime && coTime) {
            inRange = dTime > ciTime && dTime < coTime;
        } else if (ciTime && hoverTime && !coTime) {
            inRange = (dTime > ciTime && dTime <= hoverTime);
        }

        if (isCheckIn || isCheckOut) {
            classes += 'bg-luxury-olive text-white shadow-lg opacity-100 ';
        } else if (inRange) {
            classes += 'bg-luxury-gold/30 text-luxury-darkgreen opacity-100 ';
        } else {
            classes += 'hover:bg-luxury-sand/30 text-luxury-charcoal cursor-pointer ';
        }

        return classes;
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

    const formatDateDisplay = (dateString: string | null) => {
        if (!dateString) return "Pilih Tanggal";
        const d = new Date(dateString);
        return `${d.getDate()} ${monthNames[d.getMonth()]}`;
    };

    return (
        <div className="relative flex-[2] w-full flex items-center" ref={popoverRef}>
            <div className="flex flex-col md:flex-row w-full items-center">
                <div 
                    className="flex-1 w-full flex items-center px-5 py-4 border-b md:border-b-0 md:border-r border-luxury-sand/40 cursor-pointer group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-5 h-5 text-luxury-gold mr-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] uppercase font-bold text-luxury-muted tracking-widest">Check-In</span>
                        <div className="text-sm font-bold text-luxury-darkgreen mt-0.5">{formatDateDisplay(checkIn)}</div>
                    </div>
                </div>
                <div 
                    className="flex-1 w-full flex items-center px-5 py-4 cursor-pointer group"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <svg className="w-5 h-5 text-luxury-gold mr-4 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    <div className="flex flex-col w-full">
                        <span className="text-[10px] uppercase font-bold text-luxury-muted tracking-widest">Check-Out</span>
                        <div className="text-sm font-bold text-luxury-darkgreen mt-0.5">{formatDateDisplay(checkOut)}</div>
                    </div>
                </div>
            </div>

            {/* Calendar Popover */}
            {isOpen && (
                <>
                    {/* Backdrop for Mobile */}
                    <div className="fixed inset-0 bg-luxury-darkgreen/10 backdrop-blur-[2px] z-[90] md:hidden" onClick={() => setIsOpen(false)} />
                    
                    {/* Popover Wrapper */}
                    <div className={`fixed inset-0 z-[100] flex items-center justify-center pointer-events-none md:pointer-events-auto md:absolute md:inset-auto md:block ${popupPosition === 'top' ? 'md:bottom-[110%]' : 'md:top-[110%]'} md:left-0`}>
                        <div className="pointer-events-auto w-[calc(100vw-48px)] md:w-[340px] max-w-[340px] bg-white/95 backdrop-blur-2xl border border-white/50 shadow-2xl rounded-[2rem] p-5 md:p-6 animate-fade-in-up w-full">
                        <div className="flex items-center justify-between mb-6">
                            <button type="button" onClick={prevMonth} className="p-2 hover:bg-luxury-sand/20 rounded-full text-luxury-olive transition-colors">
                                <ChevronLeft className="w-5 h-5" />
                            </button>
                            <h3 className="font-serif font-bold text-lg text-luxury-darkgreen">
                                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                            </h3>
                            <button type="button" onClick={nextMonth} className="p-2 hover:bg-luxury-sand/20 rounded-full text-luxury-olive transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 mb-2">
                            {dayNames.map(day => (
                                <div key={day} className="text-center text-[10px] font-bold text-luxury-muted uppercase">
                                    {day}
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {generateDays().map((dayObj, idx) => (
                                <div
                                    key={idx}
                                    className="flex justify-center"
                                    onMouseEnter={() => dayObj.date && setHoverDate(dayObj.date)}
                                    onMouseLeave={() => setHoverDate(null)}
                                >
                                    <button
                                        type="button"
                                        onClick={() => handleDateClick(dayObj.date)}
                                        className={getDayClasses(dayObj)}
                                        disabled={isDateBooked(dayObj.date) || isDatePast(dayObj.date)}
                                    >
                                        {dayObj.date?.getDate()}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                </>
            )}
        </div>
    );
}
