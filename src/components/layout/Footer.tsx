import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="w-full py-4 px-6 mt-auto bg-white/50 backdrop-blur-sm border-t border-plum/10 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
                {/* Game Brand Logo */}
                <div className="relative h-10 w-32">
                    <Image
                        src="/logo.svg"
                        alt="DUFOGEN Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 150px"
                        priority
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-xs text-clinical hidden sm:block">Powered by</span>
                {/* Company Logo */}
                <div className="relative h-10 w-32">
                    <Image
                        src="/martindowlogo.svg"
                        alt="Martin Dow Logo"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100px, 150px"
                    />
                </div>
            </div>
        </footer>
    );
}
