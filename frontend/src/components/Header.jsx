function Header() {

    return (

        <header className="bg-dark text-white py-4 mb-2 shadow-sm">

            <div className="container text-center">

                <img
                src="/tiao-carreiro-pardinho.png"
                alt="Tião Carreiro"
                className="img-fluid rounded-circle mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />

                <h1 className="h3 fw-bold">Top 5 Músicas Mais Tocadas</h1>

                <h2 className="h5 fw-bold">Tião Carreiro & Pardinho</h2>

            </div>

        </header>

    );

}

export default Header;
