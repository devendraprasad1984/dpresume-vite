import AboutSubNav from "@/app/_components/aboutSubNav";

export default function AboutLayout({
                                        children,
                                    }: Readonly<{
    children: any;
}>) {
    return (
        <section>
            <AboutSubNav parentPage="about"/>
            <div>
                {children}
            </div>
        </section>
    );
}
