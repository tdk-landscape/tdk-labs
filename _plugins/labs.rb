require "yaml"
require "date"

module TdkLabs
  class ContentGenerator < Jekyll::Generator
    priority :high

    def generate(site)
      source_dir = File.join(site.source, "content", "labs")
      return unless Dir.exist?(source_dir)
      Dir.glob(File.join(source_dir, "*.yaml")).sort.each do |path|
        data = YAML.safe_load_file(path, permitted_classes: [Date], aliases: true)
        lab_id = data.fetch("id")
        data["layout"] = "lab"
        data["lab_id"] = lab_id
        data["description"] = data.fetch("steps").first.fetch("explain")
        data["permalink"] = "/labs/#{lab_id}/"
        doc = Jekyll::Document.new(path, site: site, collection: site.collections["labs"])
        doc.data.merge!(data)
        doc.content = ""
        site.collections["labs"].docs << doc
      end
      track_file = File.join(site.source, "content", "tracks.yaml")
      site.data["tracks"] = YAML.safe_load_file(track_file, aliases: true) if File.exist?(track_file)
    end
  end
end
