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

function normalizeExistingImagesMeta(product) {
  if (!product) return [];
  const meta = Array.isArray(product.imagesMeta) ? product.imagesMeta : null;
  if (meta && meta.length) {
    return meta
      .map((img, idx) => ({
        serial: Number(img?.serial) || idx + 1,
        url: img?.url,
        publicId: img?.publicId || "",
      }))
      .filter((x) => Boolean(x.url))
      .sort((a, b) => a.serial - b.serial);
  }

  const urls = Array.isArray(product.images) ? product.images : [];
  return urls
    .map((url, idx) => ({ serial: idx + 1, url, publicId: "" }))
    .filter((x) => Boolean(x.url));
}

function fileSignature(file) {
  if (!file) return "";
  return `${file.name}__${file.size}__${file.lastModified}`;
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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [replaceBySerial, setReplaceBySerial] = useState({});

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

        setExistingImages(normalizeExistingImagesMeta(p));
        setNewImages([]);
        setReplaceBySerial({});
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
      const fd = buildProductFormData(payload, { newImages, replaceBySerial });
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

  const replacementCount =
    Object.values(replaceBySerial).filter(Boolean).length;

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

        <Card
          title="Images"
          subtitle={
            isEdit
              ? "Images keep a stable serial. Replace a specific serial without changing the others."
              : "Upload one or more images (serial follows selection order)."
          }
        >
          {isEdit ? (
            <div className="space-y-3">
              {existingImages.length ? (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {existingImages.map((img) => (
                    <div
                      key={img.serial}
                      className="rounded-xl border border-dark/10 bg-white p-3 shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="inline-flex items-center gap-2">
                          <span className="inline-flex h-7 items-center rounded-full bg-dark/5 px-2 text-xs font-extrabold text-dark">
                            Serial #{img.serial}
                          </span>
                          {replaceBySerial[img.serial] ? (
                            <span className="text-xs font-semibold text-brand">
                              Replacement queued
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <div className="mt-2 overflow-hidden rounded-lg border border-dark/10 bg-dark/2">
                        <img
                          src={img.url}
                          alt={`Serial ${img.serial}`}
                          className="h-40 w-full object-cover"
                          loading="lazy"
                        />
                      </div>

                      <div className="mt-2 flex items-center justify-between gap-2">
                        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-dark/15 bg-white px-3 py-2 text-xs font-bold text-dark transition hover:bg-dark/5">
                          Replace image
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = (e.target.files || [])[0];
                              if (!file) return;
                              setReplaceBySerial((prev) => ({
                                ...prev,
                                [img.serial]: file,
                              }));
                            }}
                          />
                        </label>

                        {replaceBySerial[img.serial] ? (
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() =>
                              setReplaceBySerial((prev) => {
                                const next = { ...prev };
                                delete next[img.serial];
                                return next;
                              })
                            }
                          >
                            Clear
                          </Button>
                        ) : (
                          <div className="text-[11px] text-dark/50">—</div>
                        )}
                      </div>

                      {replaceBySerial[img.serial] ? (
                        <div className="mt-2 rounded-lg bg-brand/5 px-2 py-1 text-[11px] text-dark/70">
                          {replaceBySerial[img.serial]?.name}
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-dark/20 bg-dark/2 p-6 text-center text-sm text-dark/60">
                  No images yet.
                </div>
              )}

              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-dark/10 bg-dark/2 px-3 py-2">
                <div className="text-xs text-dark/70">
                  Replacements queued:{" "}
                  <span className="font-bold">{replacementCount}</span>
                </div>
                {replacementCount ? (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setReplaceBySerial({})}
                  >
                    Clear replacements
                  </Button>
                ) : null}
              </div>
            </div>
          ) : null}

          <div className={isEdit ? "mt-4" : ""}>
            <div className="flex flex-wrap items-end justify-between gap-2">
              <div>
                <div className="text-sm font-extrabold text-dark">
                  Add new images
                </div>
                <div className="text-xs text-dark/60">
                  New uploads are appended after the last serial.
                </div>
              </div>
              {newImages.length ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setNewImages([])}
                >
                  Clear selection
                </Button>
              ) : null}
            </div>

            <label className="mt-3 block">
              <div className="rounded-xl border border-dashed border-dark/20 bg-white p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-sm font-bold text-dark">
                      Choose images
                    </div>
                    <div className="mt-0.5 text-xs text-dark/55">
                      PNG/JPG/WebP supported.
                    </div>
                  </div>
                  <span className="inline-flex items-center rounded-lg bg-brand px-3 py-2 text-xs font-extrabold text-white">
                    Browse
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    const picked = Array.from(e.target.files || []);
                    if (!picked.length) return;

                    setNewImages((prev) => {
                      const seen = new Set(prev.map(fileSignature));
                      const next = prev.slice();

                      for (const file of picked) {
                        const sig = fileSignature(file);
                        if (sig && seen.has(sig)) continue;
                        if (sig) seen.add(sig);
                        next.push(file);
                      }

                      return next;
                    });

                    // allow selecting the same file again
                    e.target.value = "";
                  }}
                />
              </div>
            </label>

            {newImages.length ? (
              <div className="mt-3">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                  {newImages.map((file, idx) => (
                    <div
                      key={`${file.name}-${idx}`}
                      className="rounded-xl border border-dark/10 bg-white p-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] font-extrabold text-dark/70">
                          +{idx + 1}
                        </span>
                        <button
                          type="button"
                          className="text-[11px] font-bold text-dark/50 hover:text-dark"
                          onClick={() =>
                            setNewImages((prev) =>
                              prev.filter((_, i) => i !== idx),
                            )
                          }
                        >
                          Remove
                        </button>
                      </div>
                      <div
                        className="mt-1 truncate text-[11px] text-dark/55"
                        title={file.name}
                      >
                        {file.name}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-3 text-xs text-dark/55">
                No new images selected.
              </div>
            )}
          </div>
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
