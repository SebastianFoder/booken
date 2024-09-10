import Link from "next/link";

export default function Home() {
    return (
      <main>
        <section>
          <article className="homepage">
            <h1>Velkommen til Booken</h1>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sapiente excepturi illo sunt eum similique repellendus voluptates, doloribus provident nisi numquam, odio quasi dolore sed aut dolor veniam ut molestiae mollitia. Odit sint aliquam vitae ut autem et ipsa sunt dolores atque quia, asperiores reiciendis dicta, at architecto optio nobis quo, quam error debitis est adipisci quidem. Odio explicabo dicta sapiente.</p>
            <div className="buttons">
              <Link className="btn" href="/tags">
                <div>
                  Tags
                </div>
              </Link>
              <Link className="btn" href="/ord">
                <div>
                  Ord
                </div>
              </Link>
            </div>
          </article>
        </section>
      </main>
    );
  }
  