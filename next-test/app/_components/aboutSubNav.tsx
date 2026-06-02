import Link from "next/link";

const AboutSubNav = (props: any) => {
    const hoverClass = "hover:text-blue-400"
    const parentPage = props?.parentPage;
    return (
        <div className="flex flex-row gap-5 bg-red-200 p-2">
            <Link href={`/${parentPage}/subNav1`} className={`${hoverClass}`}>SubNav1</Link>
            <Link href={`/${parentPage}/subNav2`} className={`${hoverClass}`}>SubNav2</Link>
            <Link href={`/${parentPage}/subNav3`} className={`${hoverClass}`}>SubNav3</Link>
            <Link href={`/${parentPage}/subNav4`} className={`${hoverClass}`}>SubNav4</Link>
        </div>
    )
}

export default AboutSubNav
