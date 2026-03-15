import ServiceConfig from "@/components/admin/service-config";

export default function MenuPage() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <ServiceConfig />
        </div>
      </div>
    </div>
  );
}