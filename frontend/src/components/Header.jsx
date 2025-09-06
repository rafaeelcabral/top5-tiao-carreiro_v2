function Header() {

    return (

        <header className="bg-dark text-white py-4 mb-2 shadow-sm">

            <div className="container text-center">

                <img
                src="/profile.jpeg"
                alt="Musicas"
                className="img-fluid rounded-circle border border-4 border-white mb-3"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
                />

                <h1 className="h3 fw-bold text-light">Top Hits 🎵</h1>

                <h2 className="h5 fw-bold text-light">As Músicas mais tocadas no YouTube</h2>

            </div>

        </header>

    );

}

export default Header;
