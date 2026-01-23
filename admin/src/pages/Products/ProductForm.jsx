import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import Card from "../../components/ui/Card";
import Button from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import Textarea from "../../components/ui/Textarea";
import Spinner from "../../components/ui/Spinner";
import * as productApi from "../../lib/productApi";
import {
  buildProductFormData,
  parseCommaList,
  safeJsonParse,
} from "./productFormHelpers";

function numberOrEmpty(value) {
  if (value === "") return "";
  const n = Number(value);
  return Number.isFinite(n) ? n : "";
}

export default function ProductForm({ mode }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = mode === "edit";

  const [loading, setLoading] = useState(isEdit);
  const [busy, setBusy] = useState(false);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [vendor, setVendor] = useState("");
  const [sku, setSku] = useState("");
  const [gender, setGender] = useState("unisex");
  const [status, setStatus] = useState("draft");
  const [price, setPrice] = useState("");
  const [compareAtPrice, setCompareAtPrice] = useState("");
  const [trackInventory, setTrackInventory] = useState(true);
  const [quantity, setQuantity] = useState("0");

  const [categories, setCategories] = useState("");
  const [tags, setTags] = useState("");
  const [sizes, setSizes] = useState("");
  const [colorsJson, setColorsJson] = useState("[]");

  const [images, setImages] = useState([]);

  const initialTitle = useMemo(
    () => (isEdit ? "Edit product" : "Create product"),
    [isEdit],
  );

  useEffect(() => {
    if (!isEdit) return;

    const run = async () => {
      setLoading(true);
      try {
        const res = await productApi.getAdminById(id);
        const p = res?.data;
        if (!p) throw new Error("Product not found");

        setTitle(p.title || "");
        setSlug(p.slug || "");
        setDescription(p.description || "");
        setVendor(p.vendor || "");
        setSku(p.sku || "");
        setGender(p.gender || "unisex");
        setStatus(p.status || "draft");
        setPrice(p.price ?? "");
        setCompareAtPrice(p.compareAtPrice ?? "");
        setTrackInventory(Boolean(p.inventory?.track ?? true));
        setQuantity(String(p.inventory?.quantity ?? 0));

        setCategories((p.categories || []).join(", "));
        setTags((p.tags || []).join(", "));
        setSizes((p.sizes || []).join(", "));
        setColorsJson(JSON.stringify(p.colors || [], null, 2));
      } catch (e) {
        toast.error(e.message);
        navigate("/products", { replace: true });
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [id, isEdit, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      title,
      slug: slug || undefined,
      description,
      vendor,
      sku: sku || undefined,
      gender,
      status,
      price: numberOrEmpty(price),
      compareAtPrice: numberOrEmpty(compareAtPrice),
      categories: parseCommaList(categories),
      tags: parseCommaList(tags),
      sizes: parseCommaList(sizes),
      colors: safeJsonParse(colorsJson, []),
      inventory: {
        track: Boolean(trackInventory),
        quantity: numberOrEmpty(quantity),
      },
    };

    if (!payload.title) {
      toast.error("Title is required");
      return;
    }

    setBusy(true);
    try {
      const fd = buildProductFormData(payload, images);
      if (isEdit) {
        await productApi.updateProduct(id, fd);
        toast.success("Updated");
      } else {
        await productApi.createProduct(fd);
        toast.success("Created");
      }
      navigate("/products");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return (
      <div className="py-10 grid place-items-center">
        <Spinner label="Loading product…" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-dark tracking-tight">
            {initialTitle}
          </h1>
          <p className="mt-1 text-sm text-dark/60">
            Uses multipart upload to support images.
          </p>
        </div>
        <Link to="/products">
          <Button variant="outline">Back</Button>
        </Link>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <Card title="Basics">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              label="Slug (optional)"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              hint="Leave empty to auto-generate"
            />
            <Input
              label="Vendor"
              value={vendor}
              onChange={(e) => setVendor(e.target.value)}
            />
            <Input
              label="SKU (optional)"
              value={sku}
              onChange={(e) => setSku(e.target.value)}
            />

            <label className="block">
              <div className="mb-1 text-sm font-semibold text-dark/90">
                Gender
              </div>
              <select
                className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                value={gender}
                onChange={(e) => setGender(e.target.value)}
              >
                <option value="unisex">Unisex</option>
                <option value="men">Men</option>
                <option value="women">Women</option>
              </select>
            </label>

            <label className="block">
              <div className="mb-1 text-sm font-semibold text-dark/90">
                Status
              </div>
              <select
                className="w-full rounded-lg border border-dark/15 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/25"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <div className="flex items-end gap-3">
              <label className="inline-flex items-center gap-2 text-sm font-semibold text-dark/80">
                <input
                  type="checkbox"
                  checked={trackInventory}
                  onChange={(e) => setTrackInventory(e.target.checked)}
                />
                Track inventory
              </label>
            </div>

            <Input
              label="Quantity"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              disabled={!trackInventory}
            />

            <Input
              label="Price"
              type="number"
              value={String(price)}
              onChange={(e) => setPrice(e.target.value)}
            />
            <Input
              label="Compare at price"
              type="number"
              value={String(compareAtPrice)}
              onChange={(e) => setCompareAtPrice(e.target.value)}
              hint="Must be >= price"
            />
          </div>
        </Card>

        <Card title="Description">
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Write a short product description…"
          />
        </Card>

        <Card title="Organization">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <Input
              label="Categories (comma separated)"
              value={categories}
              onChange={(e) => setCategories(e.target.value)}
            />
            <Input
              label="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
            <Input
              label="Sizes (comma separated)"
              value={sizes}
              onChange={(e) => setSizes(e.target.value)}
              placeholder="S, M, L"
            />
            <div />
          </div>

          <Textarea
            className="mt-3"
            label="Colors (JSON array)"
            value={colorsJson}
            onChange={(e) => setColorsJson(e.target.value)}
            hint='Example: [{"name":"Black","code":"#000000"}]'
          />
        </Card>

        <Card title="Images" subtitle="Upload one or more images">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setImages(Array.from(e.target.files || []))}
          />
          {images.length ? (
            <div className="mt-2 text-xs text-dark/60">
              Selected: {images.map((f) => f.name).join(", ")}
            </div>
          ) : null}
        </Card>

        <div className="flex items-center gap-2">
          <Button type="submit" loading={busy}>
            {isEdit ? "Save changes" : "Create product"}
          </Button>
          <Link to="/products">
            <Button variant="ghost" type="button">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}
