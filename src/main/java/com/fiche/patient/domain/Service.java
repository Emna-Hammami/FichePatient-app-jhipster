package com.fiche.patient.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.io.Serializable;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Service.
 */
@Entity
@Table(name = "service")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Service implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @NotNull
    @Column(name = "nom_s", nullable = false)
    private String nomS;

    @Column(name = "description")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    private Hopital hopital;

    @JsonIgnoreProperties(value = { "hopital", "service" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY, mappedBy = "service")
    private Medecin chefService;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Service id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNomS() {
        return this.nomS;
    }

    public Service nomS(String nomS) {
        this.setNomS(nomS);
        return this;
    }

    public void setNomS(String nomS) {
        this.nomS = nomS;
    }

    public String getDescription() {
        return this.description;
    }

    public Service description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Hopital getHopital() {
        return this.hopital;
    }

    public void setHopital(Hopital hopital) {
        this.hopital = hopital;
    }

    public Service hopital(Hopital hopital) {
        this.setHopital(hopital);
        return this;
    }

    public Medecin getChefService() {
        return this.chefService;
    }

    public void setChefService(Medecin medecin) {
        if (this.chefService != null) {
            this.chefService.setService(null);
        }
        if (medecin != null) {
            medecin.setService(this);
        }
        this.chefService = medecin;
    }

    public Service chefService(Medecin medecin) {
        this.setChefService(medecin);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Service)) {
            return false;
        }
        return id != null && id.equals(((Service) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Service{" +
            "id=" + getId() +
            ", nomS='" + getNomS() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
