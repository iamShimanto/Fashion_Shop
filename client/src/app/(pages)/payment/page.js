import Breadcrumb from "@/app/components/common-components/Breadcrumb";

export default function Page() {
  return (
    <section className="pt-28 pb-5">
      <div className="px-3 flex flex-col lg:flex-row gap-8 p-6 lg:p-12 font-poppins">
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6">
          <div className="border-b pb-4">
            <p className="text-sm text-gray-500 mb-2">
              Already have an account?{" "}
              <a href="#" className="text-black font-medium underline">
                Login here
              </a>
            </p>
            <div className="flex flex-col gap-3">
              <input
                type="email"
                placeholder="Email"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                type="password"
                placeholder="Password"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <button className="w-full bg-brand border-3 border-brand tracking-wide cursor-pointer text-2xl lg:text-4xl text-text text-glow font-bebas text-center py-1 rounded mt-4  hover:text-dark/90 cardButtonHover transition">
                Login
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                placeholder="First Name*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Last Name*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Email Address*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Phone Number*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <select className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none col-span-1 md:col-span-2">
                <option>Choose Country/Region</option>
              </select>
              <input
                placeholder="Town/City*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="Street..."
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <select className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none">
                <option>Choose State</option>
              </select>
              <input
                placeholder="Postal Code*"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
            </div>
            <textarea
              placeholder="Write note..."
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            ></textarea>
          </div>
        </div>

        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 space-y-6">
          <h2 className="text-lg font-semibold">Choose payment Option:</h2>

          <div className="space-y-3">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" defaultChecked />
              Credit Card
            </label>
            <input
              placeholder="Name On Card"
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            />
            <input
              placeholder="Card Numbers"
              className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 w-full focus:outline-none"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                placeholder="mm / dd / yyyy"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
              <input
                placeholder="CVV"
                className="border-2 border-dark/60 focus:border-brand rounded px-4 py-1 focus:outline-none"
              />
            </div>
            <label className="flex items-center gap-2">
              <input type="checkbox" defaultChecked /> Save Card Details
            </label>
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" /> Cash on delivery
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" /> Apple Pay
            </label>
            <label className="flex items-center gap-2">
              <input type="radio" name="payment" /> PayPal
            </label>
          </div>

          <div className="border-t border-gray-300 pt-4 space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-medium text-2xl font-bebas tracking-wide">
                Free
              </span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Discounts</span>
              <span className="text-red-500 text-2xl font-bebas tracking-wide">
                - $80.00
              </span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between text-lg font-semibold">
              <span>Total</span>
              <span className=" text-2xl text-dark/90 font-bebas tracking-wide">
                $186.99
              </span>
            </div>
          </div>

          <button className="w-full bg-dark border-3 border-dark cursor-pointer tracking-wide text-2xl lg:text-4xl text-text text-glow font-bebas text-center py-1 rounded mt-4  hover:text-dark/90 cardButtonHover transition">
            Payment
          </button>
        </div>
      </div>
    </section>
  );
}
